/**
 * @Description:
 * @Author: fuwensong
 * @Date: 2015/5/9
 */
var _ = require('underscore');
var Backbone = require('backbone');
var Settings = require('./index').Settings;
var View = {};

_.extend(View, {
  name: 'unknown',
  role: '_default',
  frameData: {},
  parts: {},
  attributes: function () {
    var attr = {};
    if (this.name && this.name !== 'unknown') {
      attr['data-name'] = this.name;
    }
    if (this.role && this.role !== '_default') {
      attr['data-role'] = this.role;

      if (this.role === 'page' && this.actionName) {
        attr['data-action'] = this.actionName;
      }
    }

    return attr;
  },
  constructor: function() {
    Backbone.View.apply(this, arguments);

    this.on('refresh', this.render);

    // use ionic gesture events
    ionic.Gesture(this.el, this.gestures);
  },
  initialize: function () {
    if (Settings.env === 'debug') {
      console.log('View initialize.');
    }
  },
  frame: function (data) {
    data = data || this.frameData;
    this.$el.empty();

    if (this.template) {
      this.$el.html(this.template(data));
    }
    return this;
  },
  error: function (err) {
    if (Settings.env === 'debug') {
      console.log('View error, err is ' + err);
    }
  },
  renderPart: function (name, value) {
    value = value || '';
    if (!name) {
      return console.warn('View renderPart, name is invalid.');
    }
    var data = [];
    data[name] = value;

    this.renderParts(data);
  },
  renderParts: function (data) {
    if (!data) return console.error('View renderParts, data is invalid.');

    var selector;
    var $els = {};
    var key;
    for (key in data) {
      selector = this.parts[key];
      if (selector) {
        $els[key] = {$el: this.$el.find(selector), value: data[key]};
      }
    }

    var part;
    for (key in $els) {
      part = $els[key];
      part.$el.html(part.value);
    }
    delete $els;
  }
});

module.exports = Backbone.View.extend(View);