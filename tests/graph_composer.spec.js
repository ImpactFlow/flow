'use strict';

var Graph = require('../lib/graph');
var GraphComposer = require('../lib/graph_composer');

describe('graph_composer', function () {
    var composer;
    var graph1;
    var graph2;
    var resultGraph;

    function createGraph(options) {
        return new Graph(options.vertices, options.edges, options.source);
    }

    describe('when constructing with 2 undefined graphs', function () {
        it('should throw error', function () {
            var construct = function () {
                composer = new GraphComposer();
            };
            expect(construct).toThrowError('GraphComposer requires a graph as the first argument');
        });
    });

    describe('when constructing with second graph undefined', function () {
        it('should throw error', function () {
            graph1 = new Graph();
            var construct = function () {
                composer = new GraphComposer(graph1);
            };
            expect(construct).toThrowError('GraphComposer requires a graph as the second argument');
        });
    });

    describe('when composing with graphs with ambiguous vertices', function () {
        beforeEach(function () {
            graph1 = createGraph({
                vertices: {
                    'v1': 'payload',
                    'v2': 'payload'
                },
                edges: {
                    'v1': 'v2',
                },
                source: 'v1'
            });
            graph2 = createGraph({
                vertices: {
                    'v1': 'payload',
                    'v2': 'payload'
                },
                edges: {
                    'v1': 'v2',
                },
                source: 'v1'
            });
            composer = new GraphComposer(graph1, graph2);
        });

        it('should throw error on start', function () {
            var compose = function () {
                resultGraph = composer.compose();
            };
            expect(compose).toThrowError('Ambiguities over vertices: v1,v2');
        });
    });

    describe('when composing with two unambiguous single-vertex graphs', function () {
        beforeEach(function () {
            graph1 = createGraph({
                vertices: { 'v1': 'payload' },
                edges: {},
                source: 'v1',
            });
            graph2 = createGraph({
                vertices: { 'v2': 'payload' },
                edges: {},
                source: 'v2',
            });
            composer = new GraphComposer(graph1, graph2);
        });

        it('should create a graph starting at v1 and ending at v2', function () {
            resultGraph = composer.compose();
            expect(resultGraph.getAllVertexNames()).toEqual(['v1', 'v2']);
            expect(resultGraph.getAllEdges()).toEqual({ 'v1': 'v2' });
            expect(resultGraph.getSourceVertex()).toEqual('v1');
            expect(resultGraph.getAllSinkNames()).toEqual([ 'v2' ]);
        });
    });

    describe('when composing with two unambiguous multi-vertex graphs', function () {
        beforeEach(function () {
            graph1 = createGraph({
                vertices: {
                    'v1': 'payload',
                    'v2': 'payload',
                },
                edges: { 'v1': 'v2' },
                source: 'v1',
            });
            graph2 = createGraph({
                vertices: {
                    'v3': 'payload',
                    'v4': 'payload',
                },
                edges: { 'v3': 'v4' },
                source: 'v3',
            });
            composer = new GraphComposer(graph1, graph2);
        });

        it('should create a graph starting at v1 and ending at v4', function () {
            resultGraph = composer.compose();
            expect(resultGraph.getAllVertexNames()).toEqual(['v1', 'v2', 'v3', 'v4']);
            expect(resultGraph.getAllEdges()).toEqual({
                'v1': 'v2',
                'v2': 'v3',
                'v3': 'v4',
            });
            expect(resultGraph.getSourceVertex()).toEqual('v1');
            expect(resultGraph.getAllSinkNames()).toEqual([ 'v4' ]);
        });
    });
});
