<?php

require '../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver'    => 'sqlite',
    'database'  => '/tmp/my.db',
    'prefix'    => '',
]);

// Set the event dispatcher used by Eloquent models... (optional)
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
$capsule->setEventDispatcher(new Dispatcher(new Container));

// Make this Capsule instance available globally via static methods... (optional)
$capsule->setAsGlobal();

// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
$capsule->bootEloquent();

$app = new \Slim\Slim();

$app->get('/', function() use ($app) {
    readfile('index.html');
    $app->stop();
});

<% _.each(entities, function (entity) { %>
$app->get('/<%= baseName %>/<%= pluralize(entity.name) %>', function() {
    $<%= pluralize(entity.name) %> = <%= _.capitalize(entity.name) %>::all();
    echo $<%= pluralize(entity.name) %>->toJson();
});

$app->get('/<%= baseName %>/<%= pluralize(entity.name) %>/:id', function($id) use($app) {
    $<%= entity.name %> = <%= _.capitalize(entity.name) %>::find($id);
    if (is_null($<%= entity.name %>)) {
        $app->response->status(404);
        $app->stop();
    }
    echo $<%= entity.name %>->toJson();    
});

$app->post('/<%= baseName %>/<%= pluralize(entity.name) %>', function() use($app) {
    $body = $app->request->getBody();
    $obj = json_decode($body);
    $<%= entity.name %> = new <%= _.capitalize(entity.name) %>;
    <% _.each(entity.attrs, function (attr) { %>
    $<%= entity.name%>-><%= attr.attrName %> = $obj->{'<%= attr.attrName %>'};<% }); %>
    $<%= entity.name %>->save();
    $app->response->status(201);
    echo $<%= entity.name %>->toJson();    
});

$app->put('/<%= baseName %>/<%= pluralize(entity.name) %>/:id', function($id) use($app) {
    $body = $app->request->getBody();
    $obj = json_decode($body);
    $<%= entity.name %> = <%= _.capitalize(entity.name) %>::find($id);
    if (is_null($<%= entity.name %>)) {
        $app->response->status(404);
        $app->stop();
    }
    <% _.each(entity.attrs, function (attr) { %>
    $<%= entity.name%>-><%= attr.attrName %> = $obj->{'<%= attr.attrName %>'};<% }); %>
    $<%= entity.name %>->save();
    echo $<%= entity.name %>->toJson();    
});

$app->delete('/<%= baseName %>/<%= pluralize(entity.name) %>/:id', function($id) use($app) {
    $<%= entity.name %> = <%= _.capitalize(entity.name) %>::find($id);
    if (is_null($<%= entity.name %>)) {
        $app->response->status(404);
        $app->stop();
    }
    $<%= entity.name %>->delete();
    $app->response->status(204);
});

<% }); %>

$app->run();
