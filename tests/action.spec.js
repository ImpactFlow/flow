'use strict';

var Action = require('../lib/action');

describe('action', function () {
    var adapter;
    var flow;
    var payload;

    beforeEach(function () {
        flow = {
            next: jasmine.createSpy(),
        };
        payload = {};
        adapter = new Action({
            flow: flow,
            payload: payload,
        });
    });

    it('should exist', function () {
        expect(adapter).toBeDefined();
    });

    describe('when calling next', function () {
        it('should call next on the passed flow', function () {
            adapter.next();
            expect(flow.next).toHaveBeenCalled();
        });
    });

    describe('when calling start', function () {
        it('should throw no error', function () {
            adapter.start();
        });
    });
});
