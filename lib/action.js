'use strict';

var _ = require('underscore');
var assertWith = require('./assert_with');
var extend = require('./extend.js');

var Action = function (options) {
    assertWith(options)
        .expectProperty('flow', 'FlowAdapter requires a flow')
        .expectProperty('payload', 'FlowAdapter requires a payload');
    this.flow = options.flow;
    this.payload = options.payload;
};
Action.extend = _.partial(extend, Action);

_.extend(Action.prototype, {
    next: function () {
        this.flow.next();
    },

    start: function () {
        // @TODO Override in subclasses
    },
});

module.exports = Action;
