'use strict';

var _ = require('underscore');
var Edge = require('../lib/edge');
var Vertex = require('../lib/vertex');

exports.edgeData = function (edgeSource, edgeSink, pathChoiceFn) {
    return new Edge(edgeSource, edgeSink, pathChoiceFn);
};

exports.expectEdgesMatch = function (graph, expectedEdgeMap) {
    var actualEdgeMap = graph.getAllEdges().reduce(function (previous, edge) {
        var source = edge.getEdgeSource();
        if (!previous[source]) {
            previous[source] = edge.getEdgeSink();
            return previous;
        }

        if (_.isString(previous[source])) {
            previous[source] = [ previous[source] ];
        }
        previous[source].push(edge.getEdgeSink());
        return previous;
    }, {});
    expect(actualEdgeMap).toEqual(expectedEdgeMap);
};

exports.vertexData = function (name, payload) {
    return new Vertex(name, payload);
};
