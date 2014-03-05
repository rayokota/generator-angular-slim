<?php

class <%= _.capitalize(name) %> extends Illuminate\Database\Eloquent\Model {

    protected $table = "<%= pluralize(name) %>";
    public $timestamps = false;
    
    // need to explicitly cast attributes of type Integer, Float, Boolean 
    <% _.each(attrs, function (attr) { %>
    <% if (attr.attrType == 'Integer' || attr.attrType == 'Float' || attr.attrType == 'Boolean') { %>public function get<%= _.capitalize(attr.attrName) %>Attribute($value)
    {
        return (<%= attr.attrType.toLowerCase() %>) $value;
    }
    <% }}); %>
}
