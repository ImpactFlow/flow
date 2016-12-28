'use strict';

var Action = require('../lib/action');
var Flow = require('../lib/flow');
var Graph = require('../lib/graph');
var helpers = require('./helpers');

var edgeData = helpers.edgeData;
var expectEdgesMatch = helpers.expectEdgesMatch;
var vertexData = helpers.vertexData;

function defineTestFlowAction() {
    var TestFlowAction = Action.extend({
        start: jasmine.createSpy(),
    });
    return TestFlowAction;
}

describe('flow', function () {
    var Action;
    var adapterBuilderFn;
    var finishedFn;
    var flow;
    var graph;

    beforeEach(function () {
        Action = defineTestFlowAction();
        adapterBuilderFn = function (flow, payload) {
            return new Action({
                flow: flow,
                payload: payload,
            });
        };
        finishedFn = jasmine.createSpy();
    });

    describe('when constructing with a valid graph and no function arrays', function () {
        it('should default to empty arrays for functions', function () {
            flow = new Flow({
                graph: new Graph(
                    [ vertexData('v1') ],
                    [],
                    'v1'
                ),
                action_builder_functions: undefined,
                when_finished_functions: undefined,
            });
            expect(flow.getActionBuilderFunctions()).toEqual([]);
            expect(flow.getWhenFinishedFunctions()).toEqual([]);
        });
    });

    var assertStartsAdapterWith = function (payload) {
        it('should call start on an adapter with the next vertex payload', function () {
            var callingContext;
            var calls = Action.prototype.start.calls;
            callingContext = calls.mostRecent().object;
            expect(callingContext.payload).toEqual(payload);
        });
    };

    describe('when constructing with a valid graph', function () {
        beforeEach(function () {
            graph = new Graph(
                [
                    vertexData('v1', 'v1:payload'),
                    vertexData('v2', 'v2:payload'),
                    vertexData('v3', 'v3:payload'),
                ],
                [
                    edgeData('v1', 'v2'),
                    edgeData('v2', 'v3'),
                ],
                'v1'
            );
            flow = new Flow({
                graph: graph,
                action_builder_functions: [ adapterBuilderFn ],
                when_finished_functions: [ finishedFn ],
            });
        });

        describe('when calling compose', function () {
            var otherFlow;
            var otherGraph;
            var resultFlow;
            describe('with another valid flow', function () {
                beforeEach(function () {
                    otherGraph = new Graph(
                        [
                            vertexData('v4'),
                            vertexData('v5'),
                        ],
                        [
                            edgeData('v4', 'v5'),
                        ],
                        'v4'
                    );
                    otherFlow = new Flow({
                        graph: otherGraph,
                        action_builder_functions: [ adapterBuilderFn ],
                        when_finished_functions: [ finishedFn ],
                    });
                    resultFlow = flow.compose(otherFlow);
                });

                it('should return a composed flow', function () {
                    var resultGraph = resultFlow.getGraph();
                    expect(resultGraph.getAllVertexNames()).toEqual(['v1', 'v2', 'v3', 'v4', 'v5']);
                    expectEdgesMatch(resultGraph, {
                        'v1': 'v2',
                        'v2': 'v3',
                        'v3': 'v4',
                        'v4': 'v5',
                    });
                    expect(resultGraph.getSourceName()).toEqual('v1');
                    expect(resultGraph.getAllSinkNames()).toEqual([ 'v5' ]);
                });

                describe('when starting', function () {
                    it('should call both actions start functions', function () {
                        resultFlow.start();
                        expect(Action.prototype.start.calls.count()).toEqual(2);
                    });
                });

                describe('when finished', function () {
                    it('should call both finished functions', function () {
                        resultFlow.jumpTo('v5');
                        resultFlow.next();
                        expect(finishedFn.calls.count()).toEqual(2);
                    });
                });
            });
        });

        describe('when calling getCurrent', function () {
            it('should return the source vertex as the initial current vertex', function () {
                expect(flow.getCurrent().getName()).toEqual('v1');
            });
        });

        describe('when calling jumpTo', function () {
            var result;
            describe('with unknown vertex', function () {
                it('should return false', function () {
                    result = flow.jumpTo('nonexistent_vertex');
                    expect(result).toEqual(false);
                });
            });

            describe('with known vertex', function () {
                beforeEach(function () {
                    result = flow.jumpTo('v2');
                });

                it('should return true', function () {
                    expect(result).toEqual(true);
                });

                assertStartsAdapterWith('v2:payload');
            });
        });

        describe('when calling next', function () {
            describe('with next vertex available', function () {
                beforeEach(function () {
                    flow.jumpTo('v1');
                    flow.next();
                });
                assertStartsAdapterWith('v2:payload');
            });

            describe('with no next vertex available', function () {
                beforeEach(function () {
                    flow.jumpTo('v3');
                    flow.next();
                });

                it('should call the onFinished function, ending the flow', function () {
                    expect(finishedFn).toHaveBeenCalled();
                });
            });
        });

        describe('when calling start after initialization', function () {
            beforeEach(function () {
                flow.start();
            });
            assertStartsAdapterWith('v1:payload');
        });
    });

    describe('when constructing a valid multi-edge graph', function () {
        beforeEach(function () {
            graph = new Graph(
                [
                    vertexData('v1', 'v1:payload'),
                    vertexData('v2', 'v2:payload'),
                    vertexData('v3', 'v3:payload'),
                    vertexData('v4', 'v4:payload'),
                ],
                [
                    edgeData('v1', 'v2', function (options) {
                        return options.path === 'v2';
                    }),
                    edgeData('v1', 'v3', function (options) {
                        return options.path === 'v3';
                    }),
                    edgeData('v2', 'v4'),
                    edgeData('v3', 'v4'),
                ],
                'v1'
            );
            flow = new Flow({
                graph: graph,
                action_builder_functions: [ adapterBuilderFn ],
                when_finished_functions: [ finishedFn ],
            });
        });

        describe('when  starting', function () {
            beforeEach(function () {
                flow.start();
            });
            assertStartsAdapterWith('v1:payload');
        });

        describe('when starting and calling next with v2 options', function () {
            beforeEach(function () {
                flow.start();
                flow.next({ path: 'v2' });
            });

            assertStartsAdapterWith('v2:payload');

            describe('when calling next', function () {
                beforeEach(function () {
                    flow.next();
                });
                assertStartsAdapterWith('v4:payload');
            });
        });

        describe('when starting and calling next with v3 options', function () {
            beforeEach(function () {
                flow.start();
                flow.next({ path: 'v3' });
            });

            assertStartsAdapterWith('v3:payload');

            describe('when calling next', function () {
                beforeEach(function () {
                    flow.next();
                });
                assertStartsAdapterWith('v4:payload');
            });
        });
    });
});
