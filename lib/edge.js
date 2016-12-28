'use strict';

var _ = require('underscore');
var extend = require('./extend');

var defaultPathChoiceFn = function () {
    return true;
};

var Edge = function (edgeSource, edgeSink, pathChoiceFn) {
    this.edgeSource = edgeSource;
    this.edgeSink = edgeSink;
    this.pathChoiceFn = pathChoiceFn || defaultPathChoiceFn;
};
Edge.extend =  _.partial(extend, Edge);

_.extend(Edge.prototype, {
    getEdgeSink: function () {
        return this.edgeSink;
    },

    getEdgeSource: function () {
        return this.edgeSource;
    },

    shouldTakeEdge: function (options) {
        return this.pathChoiceFn(options);
    },
});

module.exports = Edge;
