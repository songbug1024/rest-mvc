/**
 * @Description:
 * @Author: fuwensong
 * @Date: 2015/5/9
 */
var _ = require('underscore');
var Backbone = require('backbone');
var Settings = require('./index').Settings;
var RestQueryString = require('./plugins/rest-querystring');
var RestUrl = require('./plugins/rest-url');
var BackboneCRUD = require('./plugins/backbone-crud');
var Collection = {};

_.extend(Collection,
  RestQueryString,
  RestUrl,
  _.pick(BackboneCRUD, 'fetch'),
  {
    name: 'unknown',
    constructor: function() {
      Backbone.Collection.apply(this, arguments);
    },
    initialize: function () {
      if (Settings.env === 'debug') {
        console.log('Collection initialize.');
      }
    },
    sync: function(method, collection, options) {
      if (Settings.env === 'debug' === 'debug') {
        console.log('Collection \'' + this.name + '\' sync: method is ' + method);
        console.log('Collection \'' + this.name + '\' sync: collection is ' + collection.toJSON());
        console.log('Collection \'' + this.name + '\' sync: options is ' + options);
      }
      return Backbone.sync(method, collection, options);
    }
  }
);

module.exports = Backbone.Collection.extend(Collection);