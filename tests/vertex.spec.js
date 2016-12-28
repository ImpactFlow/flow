'use strict';

var Vertex = require('../lib/vertex');

describe('vertex', function () {
    var name;
    var payload;
    var vertex;
    beforeEach(function () {
        name = 'v1';
        payload = { foo: 'bar' };
        vertex = new Vertex(name, payload);
    });

    it('should return name when calling getName', function () {
        expect(vertex.getName()).toEqual(name);
    });

    it('should return payload when calling getPayload', function () {
        expect(vertex.getPayload()).toEqual(payload);
    });
});
