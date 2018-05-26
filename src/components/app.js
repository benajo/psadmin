'use strict';

var $, jQuery;

(function() {
    /* eslint-disable strict */
    $ = jQuery = require('jquery');
}());

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Header = require('./common/header');

var App = React.createClass({
    render: function() {
        return (
            <div>
                <Header/>
                <div className="container-fluid">
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});

module.exports = App;
