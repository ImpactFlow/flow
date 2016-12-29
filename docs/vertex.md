# Vertex

> [lib/vertex.js](https://github.com/kgarsjo/flow/blob/master/lib/vertex.js)


A `Vertex` is a data object containing a name and a payload. It is referenced by Builders, Edges, Flows, and Graphs.

## Properties

- [`name`](#user-content-name)

- [`payload`](#user-content-payload)

## Functions

- [`constructor`](#user-content-constructor)

- [`extend`](#user-content-extend)

- [`getName`](#user-content-getname)

- [`getPayload`](#user-content-getpayload)

# Definitions

## `name`
(string): The name that uniquely identifies this vertex in a given graph. The `name` property enables convenient vertex lookup and addressing.

## `payload`
(any): The data this vertex makes available to any actions on traversal. The `payload` property can be anything, including `undefined`.

## `constructor`
Creates a new `Vertex`.

Parameters:
- `string:name`
- `any:payload`

Example:
```javascript
var vertex = new Vertex('v1', { foo: 'bar' });
```

## `extend`
Paramters:
- `object:prototypeFragment`, a map of properties which should be extended onto a new subclass of Vertex.

Returns a new Type which subclasses `Vertex` using the given prototype fragment.

Example:
```javascript
var CustomVertex = Vertex.extend({
    getName: function () {
        return 'Foo Bar ' + this.name;
    },

    favoriteFood: function () {
        return 'Pizza';
    },
});
```

## `getName`
Returns the name of this vertex.

Example:
```javascript
var name = vertex.getName();
```

## `getPayload`
Returns the payload of this vertex.

Example:
```javascript
var payload = vertex.getPayload();
```
