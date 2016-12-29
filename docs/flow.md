# Flow

> [lib/flow.js](https://github.com/kgarsjo/flow/blob/master/lib/flow.js)

A `Flow` is the primary data type of the `Flow` library. It is sometimes considered a `Traverser`, as that is its job. It consumes graphs and exposes behavior to traverse them. Flows traverse vertices and trigger actions on those vertices.

Flows are operated in a similar fashion to iterators. Their traversals can be `start`ed, they can continue on to the `next` vertex, or they can arbitrarily `jumpTo` a vertex as required:

```
var flow = new SomeFlowBuilder().build();
flow.start();
flow.next();
//...
flow.jumpTo('some vertex');
flow.next();
flow.next();
```

## Properties

- [`currentVertex`](#user-content-currentvertex)

- [`graph`](#user-content-graph)

- [`actionBuilderFunctions`](#user-content-actionbuilderfunctions)

- [`whenFinishedFunctions`](#user-content-actionbuilderfunctions)

## Functions

- [`constructor`](#user-content-constructor)

- [`extend`](#user-content-extend)

- [`getCurrent`](#user-content-getcurrent)

- [`jumpTo`](#user-content-jumpto)

- [`next`](#user-content-next)

- [`start`](#user-content-start)

# Definitions

## `currentVertex`
(Vertex): The vertex currently being traversed by this flow.

## `graph`
(Graph): The internal graph representation this `Flow` is traversing.

## `actionBuilderFunctions`
(any): An array of functions that register actions. When calling `next`, these actions will be `start`ed with the payload of the currently-traversing vertex.

## `whenFinishedFunctions`
(any): An array of functions that register callbacks when the traversal is finished. These functions will be called when the `Flow` has reached a sink vertex, and no more next edges can be traversed when calling `next`.

## `constructor`
Parameters:
- `object:options`, the parameters to pass to a Flow. Recognized parameters are `Graph:graph` (required), `array:actionBuilderFunctions`, and `array:whenFinishedFunctions`.

Creates a new `Flow`. Rather than constructing one by hand, most use cases will favor using a `Builder` to create flows.

Example:
```javascript
var flow = new Flow.Traverser({
    graph: myGraph,
    actionBuilderFunctions: [ function () {...} ],
    whenFinishedFunctions: [ function () {...} ],
});
```

## `extend`
Paramters:
- `object:prototypeFragment`, a map of properties which should be extended onto a new subclass of `Flow`.

Returns a new Type which subclasses `Flow` using the given prototype fragment.

Example:
```javascript
var CustomFlow = Flow.Traverser.extend({
    jumpTo: function (name) {
        this.currentVertex = this.graph.getVertexNamed('foo');
        return true;
    },
});
```

## `getCurrent`

Returns the `Vertex` that is currently being traversed. Callling `jumpTo` or `next` will change the current vertex.

Example:
```javascript
var vertex = flow.getCurrent();
```

## `jumpTo`
Paramters:
- `string:name`, a name of the vertex to jump to.

Returns `true` if the jump was successful, `false` otherwise.

The `jumpTo` function can be used to bypass established edges, leaping to an arbitrary vertex as needed.

Example:
```javascript
var success = flow.jumpTo('v5');
```

## `next`
Parameters:
- `any:options`, the options that will be inspected in the event of multiple edges to choose from.

Calling `next` moves the `Flow` to traverse to the next vertex in the graph, triggering actions on that next vertex. If no next vertex exists, the traversal is finished, and finished callbacks are called. The `next` function is one of the primary verbs of the `Flow` library.

Example:
```javascript
flow.next({ foo: 'bar' });
```

## `start`

Calling `start` begins the traversal at the source vertex described by the `Graph`. Calling `start` will trigger actions on the source vertex, and the traversal can then be continued by calling `next`. The `start` function is one of the primary verbs of the `Flow` library.

Example:
```javascript
flow.start();
```
