/**
 * @Description:
 * @Author: fuwensong
 * @Date: 2015/5/17
 */
var _ = require('underscore');
var $ = require('jquery');
var Easings = {
  easeOutCubic: function(pos) {
    return (Math.pow((pos - 1), 3) + 1);
  },
  easeInOutCubic: function(pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    }

    return 0.5 * (Math.pow((pos - 2), 3) + 2);
  }
};

module.exports = {
  pageStack: [],
  changePage: function (path, options) {
    options = options || {};

    var pageStack = this.pageStack;
    var isBack = !!options.isBack;

    if (isBack && pageStack.length <= 1) {
      console.warn('You have been at top page now.')
      return this.trigger('backingAtTop');
    }

    if (isBack) {
      path = pageStack[pageStack.length - 2];
    }

    var action = options.action;
    var actionArgs = options.actionArgs;
    var $containerEl = $('body');
    var $inEl = $containerEl.find(".page[data-action='" + path + "']");

    // check dom existed
    if (!$inEl || $inEl.length <= 0) {
      // doesnot existed
      var pageView = action.apply(this, actionArgs);

      if (pageView) {
        $inEl = pageView.$el;
        $inEl.attr('data-action', path);
        $containerEl.append(pageView.frame().el);
      }
    } else {
      // existed

    }

    // update stack
    var outPath;
    if (pageStack.length <= 0) {
      outPath = null;
      pageStack.push(path);
    } else {
      outPath = pageStack[pageStack.length - 1];

      var existingIndex = _.indexOf(pageStack, path);
      if (existingIndex !== -1) {
        pageStack.splice(existingIndex + 1, pageStack.length - (existingIndex + 1));
      } else {
        pageStack.push(path);
      }
    }

    var $outEl = outPath ? $containerEl.find(".page[data-action='" + outPath + "']") : [];

    animate($inEl, $outEl, _.pick(options, 'isBack', 'easing', 'immediate'));
  },
  back: function (options) {
    options = options || {};
    options.isBack = true;

    var pageStack = this.pageStack;
    if (pageStack.length <= 1) {
      console.warn('You have been at top page now.')
      return this.trigger('backingAtTop');
    }

    if (!this.lastFragment) {
      pageStack = [];
      this.navigate(this.main);
    } else {
      this.navigate(this.lastFragment, {trigger: false, replace: true});
      this.changePage(null, options);
    }
  }
}

var inAnimation = false;

function animate($inEl, $outEl, options) {
  inAnimation = true;

  options = _.extend({
    isBack: false,
    easing: 'easeOutCubic',
    immediate: false
  }, options);

  var isBack = options.isBack;
  var easing = options.easing;
  var immediate = options.immediate;

  if (!$outEl || $outEl.length <= 0) {
    $inEl.attr('nav-view', 'active');
    return;
  }

  if (immediate) {
    $inEl.attr('nav-view', 'active');
    $outEl.attr('nav-view', 'cached');
  }

  var width = $(window).width();
  var inFrom = isBack ? -width : width;
  var inTo = 0;
  var outFrom = inTo;
  var outTo = -inFrom;
  var increment = 0.025;
  var easingFn = Easings[easing];
  var incremented = 0;

  var cb = function () {
    if (incremented >= 1) {
      // animation over
      incremented = 1;
      ionic.cancelAnimationFrame(requestId);

      $inEl.attr('nav-view', 'active');
      $outEl.attr('nav-view', 'cached');
    } else {
      // in animation
      incremented += increment;

      $inEl.attr('nav-view', 'stage');
      $inEl.attr('nav-view', 'leaving');
      requestId = ionic.requestAnimationFrame(cb);
    }

    var easingIncremented = easingFn(incremented) * 100;
    $inEl.css('left', (!isBack ? 100 - easingIncremented : -100 + easingIncremented) + '%');
    $outEl.css('left', (!isBack ? 0 - easingIncremented : easingIncremented) + '%');
  }

  var requestId = ionic.requestAnimationFrame(cb);
}