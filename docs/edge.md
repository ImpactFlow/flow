# Edge

> [lib/edge.js](https://github.com/kgarsjo/flow/blob/master/lib/edge.js)


An `Edge` is a data object containing a source, a sink, and an optional choice function. It is referenced by Builders, Flows, and Graphs.

## Properties

- [`edgeSource`](#user-content-edgesource)

- [`edgeSink`](#user-content-edgesink)

- [`pathChoiceFn`](#user-content-pathchoicefn)

## Functions

- [`constructor`](#user-content-constructor)

- [`extend`](#user-content-extend)

- [`getEdgeSink`](#user-content-getedgesink)

- [`getEdgeSource`](#user-content-getedgesource)

- [`shouldTakeEdge`](#user-content-shouldtakeedge)

# Definitions

## `edgeSource`
(string): The name of the vertex this edge starts from.

## `edgeSink`
(string) :The name of the vertex this edge connects to.

## `pathChoiceFn`
(function): The optional function that will be called to decide if this is the edge that will be welected when `next` is called on the flow.

## `constructor`
Creates a new `Edge`.

Parameters:
- `string:edgeSource`
- `string:edgeSink`
- `function:pathChoiceFn`. If no `pathChoiceFn` is provided, this edge will be selected if it is examined during a call to `next` on a flow.

Example:
```javascript
var edge = new Edge('onboard_start, 'onboard_login', function (options) {
  return options.onboard_type = 'login';
});
```

## `extend`
Paramters:
- `object:prototypeFragment`, a map of properties which should be extended onto a new subclass of `Edge`.

Returns a new Type which subclasses `Edge` using the given prototype fragment.

Example:
```javascript
var CustomEdge = Edge.extend({
    getEdgeSource: function () {
        return 'Foo Bar ' + this.edgeSource;
    },

    favoriteFood: function () {
        return 'Pizza';
    },
});
```

## `getEdgeSink`
Returns the name of this edge's sink vertex.

Example:
```javascript
var sinkName = edge.getEdgeSink();
```

## `getEdgeSource`
Returns the name of this edge's source vertex.

Example:
```javascript
var sourceName = edge.getEdgeSource();
```

## `shouldTakeEdge`
Parameters:
- `object:options`, the options that will be considered by the choice function.

If no `pathChoiceFn` was provided on construction, the return will always be `true`.
Otherwise, the return will be the result of the `pathChoiceFunction` called with the given options.

Example:
```javascript
var result = edge.shouldTakeEdge({
  onboard_type: signup,
});
```
