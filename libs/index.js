/**
 * @Description:
 * @Author: fuwensong
 * @Date: 2015/5/23
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Settings = require('../settings.json');
var RestMVC = {};

Backbone.$ = $;

RestMVC.config = function (options) {
  options = options || {};

  RestMVC.Settings = _.extend(Settings, options.settings || {});
  RestMVC.Model = require('./model');
  RestMVC.Collection = require('./collection');
  RestMVC.View = require('./view');
  RestMVC.Router = require('./router');
  RestMVC.Controller = require('./controller');

  // TODO
}

RestMVC.start = function (app, options) {
  options = options || {};

  var globalName = options.globalName || '_restMVCApp';
  RestMVC.App = window[globalName] = app;

  Backbone.history.start(options);
}

RestMVC.plugin = function (name) {
  switch (name) {
    case 'storage':
      return require('./plugins/storage');
    case 'backbone-crud':
      return require('./plugins/backbone-crud');
    case 'rest-querystring':
      return require('./plugins/rest-querystring');
    case 'rest-url':
      return require('./plugins/rest-url');
    case 'ionic':
      return require('./plugins/ionic');
    case 'util':
      return require('./plugins/util');
  }
}

module.exports = RestMVC;