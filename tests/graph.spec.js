'use strict';

var Graph = require('../lib/graph');

describe('graph', function () {
    var edges;
    var graph;
    var source;
    var vertices;

    var vertexData = function (name) {
        return { name: name };
    };

    describe('when constructing a graph with no arguments', function () {
        beforeEach(function () {
            graph = new Graph();
        });

        it('should default edges property to an empty object', function () {
            expect(graph.getAllEdges()).toEqual({});
        });

        it('shoudl default vertices propery to an empty object', function () {
            expect(graph.getAllVertexNames()).toEqual([]);
        });

        it('should fail validation because of no defined source', function () {
            var validate = function () {
                graph.validate();
            };
            expect(validate).toThrowError('Source is not defined');
        });
    });

    describe('when constructing a single-vertex graph with integrity', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData('v1'),
            };
            source = 'v1';
            graph = new Graph(vertices, edges, source);
        });

        describe('when calling getAllTargets', function () {
            it('should return an array containing the source', function () {
                expect(graph.getAllTargets()).toEqual([ 'v1' ]);
            });
        });

        describe('when calling validate', function () {
            it('should not throw error', function () {
                var validate = function () {
                    graph.validate();
                };
                expect(validate).not.toThrowError();
            });
        });
    });

    describe('when constructing a multi-vertex graph without integrity', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData('v1'),
                'v2': vertexData('v2'),
            };
            edges = {
                'v1': 'v2',
                'v2': 'v3', // Invalid Integrity - no v3 vertex
            };
            source = 'v1';
            graph = new Graph(vertices, edges, source);
        });

        describe('when calling getAllEdges', function () {
            it('should return edge property', function () {
                expect(graph.getAllEdges()).toEqual(edges);
            });
        });

        describe('when calling getAllEdgeTargets', function () {
            it('should return an array containing edgeSources and edgeDestinations', function () {
                expect(graph.getAllEdgeTargets()).toEqual(['v1', 'v2', 'v3']);
            });
        });

        describe('when calling getAllTargets', function () {
            it('should return an array containing edge sources, destinations, and the graph source', function () {
                expect(graph.getAllTargets()).toEqual(['v1', 'v2', 'v3']);
            });
        });

        describe('when calling getAllVertexNames', function () {
            it('should return an array containing vertices', function () {
                expect(graph.getAllVertexNames()).toEqual(['v1', 'v2']);
            });
        });

        describe('when calling getNextVertex', function () {
            it('should return the next vertex described by the edges', function () {
                expect(graph.getNextVertex('v2')).toEqual('v3');
            });
        });

        describe('when calling getSourceVertex', function () {
            it('should return the source property', function () {
                expect(graph.getSourceVertex()).toEqual(source);
            });
        });

        describe('when calling getVertexPayload',function () {
            it('should return the payload for the given vertex', function () {
                expect(graph.getVertexPayload('v1')).toEqual(vertexData('v1'));
            });
        });

        describe('when calling hasVertex', function () {
            it('should return false for a nonexistent vertex', function () {
                expect(graph.hasVertex('nonexistent')).toEqual(false);
            });

            it('should return true for a known vertex', function () {
                expect(graph.hasVertex('v2')).toEqual(true);
            });
        });
    });

    describe('when constructing a multi-vertex graph with integrity', function () {
        beforeEach(function () {
            vertices = {
                'v1': vertexData('v1'),
                'v2': vertexData('v2'),
            };
            edges = {
                'v1': 'v2',
            };
            source = 'v1';
            graph = new Graph(vertices, edges, source);
        });

        describe('when calling getAllSinkNames', function () {
            it('should return an array containing sinks -vertices that have no next target', function () {
                expect(graph.getAllSinkNames()).toEqual([ 'v2' ]);
            });
        });

        describe('when calling validate', function () {
            it('should not throw error', function () {
                var validate = function () {
                    graph.validate();
                };
                expect(validate).not.toThrowError();
            });
        });
    });
});
