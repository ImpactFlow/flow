'use strict';

var Graph = require('../lib/graph');
var helpers = require('./helpers');

var edgeData = helpers.edgeData;
var vertexData = helpers.vertexData;

describe('graph', function () {
    var edges;
    var graph;
    var source;
    var vertices;

    describe('when constructing a graph with no arguments', function () {
        beforeEach(function () {
            graph = new Graph();
        });

        it('should default edges property to an empty object', function () {
            expect(graph.getAllEdges()).toEqual([]);
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
            vertices = [
                vertexData('v1'),
            ];
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
            vertices = [
                vertexData('v1'),
                vertexData('v2'),
            ];
            edges = [
                edgeData('v1', 'v2'),
                edgeData('v2', 'v3'), // Invalid Integrity - no v3 vertex
            ];
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
                expect(graph.getNextVertex(vertices[0])).toEqual(vertices[1]);
            });
        });

        describe('when calling getSourceName', function () {
            it('should return the source property', function () {
                expect(graph.getSourceName()).toEqual(source);
            });
        });

        describe('when calling getSourceVertex', function () {
            it('should return the vertex whose name matches the source property', function () {
                expect(graph.getSourceVertex()).toEqual(vertices[0]);
            });
        });

        describe('when calling hasVertexNamed', function () {
            it('should return false for a nonexistent vertex', function () {
                expect(graph.hasVertexNamed('nonexistent')).toEqual(false);
            });

            it('should return true for a known vertex', function () {
                expect(graph.hasVertexNamed('v2')).toEqual(true);
            });
        });
    });

    describe('when constructing a multi-vertex graph with integrity', function () {
        beforeEach(function () {
            vertices = [
                vertexData('v1'),
                vertexData('v2'),
            ];
            edges = [
                edgeData('v1', 'v2'),
            ];
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

    describe('when constructing a muli-vertex multi-edge graph with integrity', function () {
        beforeEach(function () {
            vertices = [
                vertexData('v1'),
                vertexData('v2'),
                vertexData('v3'),
                vertexData('v4'),
            ];
            edges = [
                edgeData('v1', 'v2', function () {
                    return false;
                }),
                edgeData('v1', 'v3', function () {
                    return true;
                }),
                edgeData('v2', 'v4'),
                edgeData('v3', 'v4'),
            ];
            source = 'v1';
            graph = new Graph(vertices, edges, source);
        });

        describe('when calling getAllSinkNames', function () {
            it('should return an array containing sinks -vertices that have no next target', function () {
                expect(graph.getAllSinkNames()).toEqual([ 'v4' ]);
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
