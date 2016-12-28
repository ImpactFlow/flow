'use strict';

var _ = require('underscore');
var extend = require('./extend');
var GraphValidator = require('./graph_validator');

var Graph = function (vertices, edges, source) {
    this.vertices = vertices || [];
    this.edges = edges || [];
    this.source = source;

    this.vertexMap = this.vertices.reduce(function (previous, vertex) {
        previous[vertex.getName()] = vertex;
        return previous;
    }, {});

    this.edgeMap = this.edges.reduce(function (previous, edge) {
        if (!previous[edge.getEdgeSource()]) {
            previous[edge.getEdgeSource()] = [];
        }
        previous[edge.getEdgeSource()].push(edge);
        return previous;
    }, {});
};
Graph.extend =  _.partial(extend, Graph);

_.extend(Graph.prototype, {
    getAllEdges: function () {
        return this.edges;
    },

    getAllEdgeTargets: function () {
        var edgeTargets = this.getAllEdges().reduce(function (previous, edge) {
            previous.push(edge.getEdgeSource());
            previous.push(edge.getEdgeSink());
            return previous;
        }, []);
        return _.uniq(edgeTargets);
    },

    getAllSinkNames: function () {
        var edgeSources = _.keys(this.edgeMap);
        return _.difference(this.getAllVertexNames(), edgeSources);
    },

    getAllTargets: function () {
        var sources = [ this.getSourceName() ];
        return _.union(this.getAllEdgeTargets(), sources);
    },

    getAllVertexNames: function () {
        return _.keys(this.vertexMap);
    },

    getAllVertices: function () {
        return this.vertices;
    },

    getNextVertex: function (vertex, options) {
        var edges = this.edgeMap[vertex.getName()];
        if (!edges) {
            return;
        }
        var nextEdgeIdx = _.findIndex(edges, function (edge) {
            return edge.shouldTakeEdge(options);
        });
        var nextEdge = edges[nextEdgeIdx];
        return this.vertexMap[nextEdge.getEdgeSink()];
    },

    getSourceName: function () {
        return this.source;
    },

    getSourceVertex: function () {
        return this.getVertexNamed(this.source);
    },

    getVertexNamed: function (name) {
        return this.vertexMap[name];
    },

    hasVertexNamed: function (name) {
        return _.has(this.vertexMap, name);
    },

    validate: function () {
        new GraphValidator(this).validate();
    },
});

module.exports = Graph;
