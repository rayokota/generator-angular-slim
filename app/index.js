'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    pluralize = require('pluralize'),
    asciify = require('asciify');

var AngularSlimGenerator = module.exports = function AngularSlimGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });

    if (this.generatorConfig.databaseType === 'sqlite') {
      this.spawnCommand('sqlite3', ['-line', this.generatorConfig.databaseName, 'select 1']);
    }

    if (this.generatorConfig.composer) {
      this.spawnCommand('composer', ['update']);
    }
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AngularSlimGenerator, yeoman.generators.Base);

AngularSlimGenerator.prototype.askFor = function askFor() {

  var cb = this.async();

  console.log('\n' +
    '+-+-+-+-+-+-+-+ +-+-+-+-+ +-+-+-+-+-+-+-+-+-+\n' +
    '|a|n|g|u|l|a|r| |s|l|i|m| |g|e|n|e|r|a|t|o|r|\n' +
    '+-+-+-+-+-+-+-+ +-+-+-+-+ +-+-+-+-+-+-+-+-+-+\n' +
    '\n');

  var prompts = [{
    type: 'input',
    name: 'baseName',
    message: 'What is the name of your application?',
    default: 'myapp'
  },
  {
    type: 'list',
    name: 'databaseType',
    message: 'Which database would you like to use?',
    choices: ['SQLite', 'MySQL', 'PostgreSQL'],
    default: 'SQLite'
  },
  {
    type: 'input',
    name: 'hostName',
    message: 'What is your host name?',
    default: 'localhost'
  },
  {
    type: 'input',
    name: 'databaseName',
    message: 'What is your database name?',
    default: 'my_db'
  },
  {
    type: 'input',
    name: 'userName',
    message: 'What is your database user name?',
    default: ''
  },
  {
    type: 'input',
    name: 'password',
    message: 'What is your database password?',
    default: ''
  },
  {
    type: 'confirm',
    name: 'composer',
    message: 'Is PHP composer installed globally (so that "composer update" can be run automatically)?',
    default: false
  }];

  this.prompt(prompts, function (props) {
    this.baseName = props.baseName;
    this.databaseType = props.databaseType == 'PostgreSQL' ? 'pgsql' : props.databaseType.toLowerCase();
    this.hostName = props.hostName;
    if (props.databaseType == 'SQLite' && props.databaseName.indexOf('/') != 0) {
      this.databaseName = '/tmp/' + props.databaseName;
    } else {
      this.databaseName = props.databaseName;
    }
    this.userName = props.userName;
    this.password = props.password;
    this.composer = props.composer;

    cb();
  }.bind(this));
};

AngularSlimGenerator.prototype.app = function app() {

  this.entities = [];
  this.generatorConfig = {
    "baseName": this.baseName,
    "databaseType": this.databaseType,
    "hostName": this.hostName,
    "databaseName": this.databaseName,
    "userName": this.userName,
    "password": this.password,
    "entities": this.entities,
    "composer": this.composer,
  };
  this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');

  this.template('_generator.json', 'generator.json');
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('bowerrc', '.bowerrc');
  this.template('Gruntfile.js', 'Gruntfile.js');
  this.copy('gitignore', '.gitignore');

  var configDir = 'config/'
  var migrationsDir = configDir + 'migrations/'
  var modelsDir = 'models/'
  var publicDir = 'public/'
  var vendorDir = 'vendor/'
  this.mkdir(configDir);
  this.mkdir(migrationsDir);
  this.mkdir(modelsDir);
  this.mkdir(publicDir);
  this.mkdir(vendorDir);

  this.template('_composer.json', 'composer.json');
  this.template('config/_phpmig.php', configDir + 'phpmig.php');
  this.template('public/_index.php', publicDir + 'index.php');
  this.copy('public/htaccess', publicDir + '.htaccess');

  var publicCssDir = publicDir + 'css/';
  var publicJsDir = publicDir + 'js/';
  var publicViewDir = publicDir + 'views/';
  this.mkdir(publicCssDir);
  this.mkdir(publicJsDir);
  this.mkdir(publicViewDir);
  this.template('public/_index.html', publicDir + 'index.html');
  this.copy('public/css/app.css', publicCssDir + 'app.css');
  this.template('public/js/_app.js', publicJsDir + 'app.js');
  this.template('public/js/home/_home-controller.js', publicJsDir + 'home/home-controller.js');
  this.template('public/views/home/_home.html', publicViewDir + 'home/home.html');
};

AngularSlimGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
