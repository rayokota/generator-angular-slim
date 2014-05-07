# The Angular-Slim generator 

A [Yeoman](http://yeoman.io) generator for [AngularJS](http://angularjs.org) and [Slim](http://www.slimframework.com/).

Slim is a PHP-based micro-framework.  For AngularJS integration with other micro-frameworks, see https://github.com/rayokota/MicroFrameworkRosettaStone.

## Installation

Install [Git](http://git-scm.com), [node.js](http://nodejs.org), and [PHP 5.4](http://www.php.net/).  The development mode also requires [SQLite](http://www.sqlite.org) or [MySql](http://www.mysql.com/).

Install Yeoman:

    npm install -g yo

Install the Angular-Slim generator:

    npm install -g generator-angular-slim

The above prerequisites can be installed to a VM using the [Angular-Slim provisioner](https://github.com/rayokota/provision-angular-slim).

## Creating a Slim service

In a new directory, generate the service:

    yo angular-slim

Install [Composer](https://getcomposer.org/):

	curl -s http://getcomposer.org/installer | php
	
If you chose to update Composer automatically :

	composer update

will run automatically, if not Install dependencies

	php composer.phar update

Run the service:

    php -S 127.0.0.1:8080 -t public

Your service will run at [http://localhost:8080](http://localhost:8080).


## Creating a persistent entity

Generate the entity:

    yo angular-slim:entity [myentity]

You will be asked to specify attributes for the entity, where each attribute has the following:

- a name
- a type (String, Integer, Float, Boolean, Date, Enum)
- for a String attribute, an optional minimum and maximum length
- for a numeric attribute, an optional minimum and maximum value
- for a Date attribute, an optional constraint to either past values or future values
- for an Enum attribute, a list of enumerated values
- whether the attribute is required

Files that are regenerated will appear as conflicts.  Allow the generator to overwrite these files as long as no custom changes have been made.

If you chose to update Composer automatically :

	composer update
	
will run automatically, if not Install dependencies

	php composer.phar update

Run the service:

    php -S 127.0.0.1:8080 -t public
    
A client-side AngularJS application will now be available by running

	grunt server
	
The Grunt server will run at [http://localhost:9000](http://localhost:9000).  It will proxy REST requests to the Slim service running at [http://localhost:8080](http://localhost:8080).

At this point you should be able to navigate to a page to manage your persistent entities.  

The Grunt server supports hot reloading of client-side HTML/CSS/Javascript file changes.

