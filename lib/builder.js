'use strict';

var _ = require('underscore');
var assertWith = require('./assert_with');
var extend = require('./extend');
var Edge = require('./edge');
var Flow = require('./flow');
var Graph = require('./graph');
var Vertex = require('./vertex');

var Builder = function () {
    this.vertices = [];
    this.edges = [];
    this.source = undefined;
    this.graph = undefined;
    this.actionBuilderFunctions = [];
    this.whenFinishedFunctions = [];
};
Builder.extend = _.partial(extend, Builder);

_.extend(Builder.prototype, {
    _buildVertexEdges: function (vertex, next) {
        if (!next) {
            return [];
        }
        if (_.isString(next)) {
            return [
                new Edge(vertex.getName(), next)
            ];
        }
        return _.keys(next).reduce(function (previous, edgeSink) {
            var pathChoiceFn = next[edgeSink];
            previous.push(new Edge(vertex.getName(), edgeSink, pathChoiceFn));
            return previous;
        }, []);
    },

    addActionBuilder: function (actionBuilderFn) {
        this.actionBuilderFunctions.push(actionBuilderFn);
        return this;
    },

    addVertex: function (options, payload) {
        assertWith(options).expectProperty('name', 'An added vertex requres a name');
        var vertex = new Vertex(options.name, payload);
        this.vertices.push(vertex);
        this.edges = this.edges.concat(this._buildVertexEdges(vertex, options.next));
        return this;
    },

    build: function () {
        this.graph = new Graph(this.vertices, this.edges, this.source);
        return new Flow({
            graph: this.graph,
            action_builder_functions: this.actionBuilderFunctions,
            when_finished_functions: this.whenFinishedFunctions,
        });
    },

    startAtVertex: function (sourceVertexName) {
        this.source = sourceVertexName;
        return this;
    },

    whenFinished: function (whenFinishedFn) {
        this.whenFinishedFunctions.push(whenFinishedFn);
        return this;
    },
});

module.exports = Builder;
