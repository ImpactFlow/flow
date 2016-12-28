'use strict';

var Flow = require('../flow');

describe('flow', function () {
    [
        'Action',
        'Builder',
        'Edge',
        'Graph',
        'GraphComposer',
        'GraphValidator',
        'Traverser',
        'Vertex',
    ].forEach(function (namespace) {
        it('should have an extensible namespaced constructor', function () {
            expect(Flow[namespace]).toBeDefined();
            expect(typeof Flow[namespace]).toEqual('function');

            expect(Flow[namespace].extend).toBeDefined();
            expect(typeof Flow[namespace].extend).toEqual('function');
        });
    });
});
