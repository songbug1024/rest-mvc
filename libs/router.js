/**
 * @Description:
 * @Author: fuwensong
 * @Date: 2015/5/9
 */
var _ = require('underscore');
var Backbone = require('backbone');
var Settings = require('./index').Settings;
var PageManagement = require('./plugins/page-management');
var Router = {};

_.extend(Router, PageManagement, {
  main: '',
  controllers: {},
  routes: {},
  constructor: function() {
    Backbone.Router.apply(this, arguments);

    var self = this;
    var controllers = this.controllers;

    _.each(this.routes, function (path, route, routes) {
      var parts, controller, action;

      parts = path.split('.');

      if (parts.length === 2) {
        controller = controllers[parts[0]];
        if (!controller) {
          return console.error('Route controller \'' + controller + '\' not found.');
        }

        action = controller[parts[1]];
        if (!action) {
          return console.error('Route action \'' + action + '\' not found.');
        }

        if (Settings.env === 'debug')
          console.log('Route adding: route is \'' + route + '\', path is \'' + path + '\'.');

        self.route(route, path, function () {
          this.changePage(path, {action: action, actionArgs: arguments});
        });

      } else {
        // Do nothing, use Backbone default routes solution
      }
    });

    this.on('beforeNavigate', this.__beforeNavigate);
  },
  action: function (path, data, callback) {
    if (!path) return console.error('Router action: path is invalid.');

    var parts = path.split('.');
    var action = this.controllers[parts[0]][parts[1]];

    if (!action) {
      return console.error('Router action: action is invalid.');
    }
    action.call(this, data, callback);
  },
  navigate: function (fragment, options) {
    options = _.extend({
      trigger: true,
      replace: false
    }, options || {});

    this.trigger('beforeNavigate', fragment, options);

    var result = Backbone.Router.prototype.navigate.apply(this, arguments);

    this.trigger('afterNavigate', fragment, options);
    return result;
  },
  __beforeNavigate: function (fragment, options) {
    // record fragment
    this.lastFragment = this.currentFragment;
    this.currentFragment = fragment;
  }
});

module.exports = Backbone.Router.extend(Router);