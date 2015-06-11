/**
 * @Description:
 * @Author: fuwensong
 * @Date: 2015/5/10
 */
var _ = require('underscore');
var Backbone = require('backbone');

module.exports = {
  fetch: function() {
    var options = !arguments[0] || _.isFunction(arguments[0]) ? {} : arguments[0];
    var callback = arguments[arguments.length - 1];

    options.success = function ($scope, res, options) {
      callback.call($scope, null, res, options);
    };
    options.error = function ($scope, res, options) {
      callback.call($scope, res, options);
    };

    Backbone.Model.prototype.fetch.call(this, options);
  },
  save: function() {
    var attrs = _.isFunction(arguments[0]) ? this.attributes : arguments[0];
    var options = !arguments[1] || _.isFunction(arguments[1]) ? {} : arguments[1];
    var callback = arguments[arguments.length - 1];

    options.success = function ($scope, res, options) {
      callback.call($scope, null, res, options);
    };
    options.error = function ($scope, res, options) {
      callback.call($scope, res, options);
    };

    Backbone.Model.prototype.save.apply(this, [attrs, options]);
  },
  destroy: function() {
    var options = !arguments[0] || _.isFunction(arguments[0]) ? {} : arguments[0];
    var callback = arguments[arguments.length - 1];

    options.success = function ($scope, res, options) {
      callback.call($scope, null, res, options);
    };
    options.error = function ($scope, res, options) {
      callback.call($scope, res, options);
    };

    Backbone.Model.prototype.destroy.call(this, options);
  }
};