/**
 * @Description:
 * @Author: fuwensong
 * @Date: 2015/5/10
 */
var _ = require('underscore');
var Storage = {};

Storage.get = function (key, defaultValue) {
  if (!key) return console.error('Storage get key is invalid.');

  return this.$scope.getItem(key) || defaultValue;
}

Storage.set = function (key, value) {
  if (!key) return console.error('Storage set key is invalid.');

  this.$scope.setItem(key, value);
}

Storage.remove = function (key) {
  if (!key) return console.error('Storage remove key is invalid.');

  this.$scope.removeItem(key);
}

Storage.clear = function () {

  this.$scope.clear();
}

Storage.getJSON = function (key, defaultJSON) {
  var value = this.get(key);

  return value ? JSON.parse(value) : defaultJSON;
}

Storage.setJSON = function (key, json) {
  var value = json ? JSON.stringify(json) : '';

  this.set(key, value);
}

Storage.getArray = Storage.getJSON;

Storage.setArray = Storage.setJSON;

module.exports = {
  localStorage: _.extend({$scope: localStorage}, Storage),
  sessionStorage: _.extend({$scope: sessionStorage}, Storage),
};