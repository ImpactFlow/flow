'use strict';

var _ = require('underscore');
var assertWith = require('./assert_with');
var extend = require('./extend');
var Edge = require('./edge');
var Graph = require('./graph');

var GraphComposer = function (graph1, graph2) {
    this.graph1 = graph1;
    this.graph2 = graph2;
    assertWith(this)
        .expectProperty('graph1', 'GraphComposer requires a graph as the first argument')
        .expectProperty('graph2', 'GraphComposer requires a graph as the second argument');
};
GraphComposer.extend = _.partial(extend, GraphComposer);

_.extend(GraphComposer.prototype, {
    compose: function ()  {
        this.checkForAmbiguities();
        var source = this.getFirstGraph().getSourceName();
        var vertices = this.combineAllVertices();
        var edges = this.combineAllEdges();
        return new Graph(vertices, edges, source);
    },

    bridgeSinksToSource: function () {
        var firstGraphSinks = this.getFirstGraph().getAllSinkNames();
        var secondGraphSource = this.getSecondGraph().getSourceName();
        return firstGraphSinks.reduce(function (bridgeEdges, sinkName) {
            bridgeEdges.push(new Edge(sinkName, secondGraphSource));
            return bridgeEdges;
        }, []);
    },

    checkForAmbiguities: function () {
        var ourVertexNames = this.getFirstGraph().getAllVertexNames();
        var theirVertexNames = this.getSecondGraph().getAllVertexNames();
        var ambiguities = _.intersection(ourVertexNames, theirVertexNames);
        if (ambiguities.length) {
            throw new Error('Ambiguities over vertices: ' + ambiguities);
        }
    },

    combineAllVertices: function () {
        var ourVertices = this.getFirstGraph().getAllVertices();
        var theirVertices = this.getSecondGraph().getAllVertices();
        var union = _.union(ourVertices, theirVertices);
        return _.uniq(union);
    },

    combineAllEdges: function () {
        var ourEdges = this.getFirstGraph().getAllEdges();
        var theirEdges = this.getSecondGraph().getAllEdges();
        var bridgeEdges = this.bridgeSinksToSource();
        var union = _.union(ourEdges, theirEdges, bridgeEdges);
        return _.uniq(union);
    },

    getFirstGraph: function () {
        return this.graph1;
    },

    getSecondGraph: function () {
        return this.graph2;
    },
});

module.exports = GraphComposer;
