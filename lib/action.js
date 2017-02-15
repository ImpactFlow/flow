'use strict';

var _ = require('underscore');
var extend = require('./extend.js');

var Action = function () {};
Action.extend = _.partial(extend, Action);

_.extend(Action.prototype, {
    next: function () {
        this.flow.next();
    },

    setFlow: function (flow) {
        this.flow = flow;
    },

    start: function (/* payload */) {
        // @TODO Override in subclasses
    },
});

module.exports = Action;
