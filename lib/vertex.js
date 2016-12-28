'use strict';

var _ = require('underscore');
var extend = require('./extend');

var Vertex = function (name, payload) {
    this.name = name;
    this.payload = payload;
};
Vertex.extend = _.partial(extend, Vertex);

_.extend(Vertex.prototype, {
    getName: function () {
        return this.name;
    },

    getPayload: function () {
        return this.payload;
    },
});

module.exports = Vertex;
