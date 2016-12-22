'use strict';

var _ = require('underscore');
var extend = require('./extend');
var GraphValidator = require('./graph_validator');

var Graph = function (vertices, edges, source) {
    this.vertices = vertices || {};
    this.edges = edges || {};
    this.source = source;
};
Graph.extend =  _.partial(extend, Graph);

_.extend(Graph.prototype, {
    getAllEdges: function () {
        return this.edges;
    },

    getAllEdgeTargets: function () {
        var edgeSources = _.keys(this.getAllEdges());
        var edgeDestinations = _.values(this.getAllEdges());
        return _.union(edgeSources, edgeDestinations);
    },

    getAllSinkNames: function () {
        var edgeSources = _.keys(this.getAllEdges());
        return _.difference(this.getAllVertexNames(), edgeSources);
    },

    getAllTargets: function () {
        var sourceVertices = [ this.getSourceVertex() ];
        return _.union(this.getAllEdgeTargets(), sourceVertices);
    },

    getAllVertexNames: function () {
        return _.keys(this.getAllVertices());
    },

    getAllVertices: function () {
        return this.vertices;
    },

    getNextVertex: function (vertex) {
        return this.edges[vertex];
    },

    getSourceVertex: function () {
        return this.source;
    },

    getVertexPayload: function (vertex) {
        return this.vertices[vertex];
    },

    hasVertex: function (vertex) {
        return _.has(this.getAllVertices(), vertex);
    },

    validate: function () {
        new GraphValidator(this).validate();
    },
});

module.exports = Graph;
