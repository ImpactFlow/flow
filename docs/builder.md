# Builder

> [lib/builder.js](https://github.com/kgarsjo/flow/blob/master/lib/builder.js)

a `Builder` is responsible for generating a flow using a fluent API that gathers vertices, actions, callbacks, and other information required to construct a flow.

`Builder`s should primarily be extended to preload building instructions in `initialize` for specific types of flows, and/or to create wrappers around core `Builder` functions like `addVertex` to more cleanly map to a specific domain.

In the example below, we create a counting flow builder which adds vertices for counts 1 to n and presets actions and callbacks when finished.

Example:
```javascript
var LogAction = Flow.Action.extend({
    start: function () {
        console.log('Counted: ' + this.payload);
    },
});

var CountingFlowBuilder = Flow.Builder.extend({
    initialize: function (n) {
        for (var i = 1; i <= n; i++) {
            this.addCountStep(i, n);
        }
        this.startAtVertex('v1')
            .addActionBuilder(function (flow, payload) {
                return new LogAction({ flow: flow, payload: payload });
            }).whenFinished(functon () {
                console.log('Finished!');
            });
    },
    
    addCountStep: function (i, n) {
        var vertexName = 'v' + i;
        var nextVertex = (i === n) ? undefined : 'v' + (i + 1);
        return this.addVertex({ name: vertexName, next: nextVertex });
    },
});

var flow = new CountingFlowBuilder(100).build();
flow.start();
for (var i = 0; i < 100; i++) {
    flow.next();
}

// Counted: 1
// Counted: 2
// Counted: 3
// ...
// Counted: 98
// Counted: 99
// Counted: 100
// Finishsed!
```

## Properties

- [`vertices`](#user-content-vertices)

- [`edges`](#user-content-edges)

- [`source`](#user-content-source)

- [`graph`](#user-content-graph)

- [`actionBuilderFunctions`](#user-content-edges)

- [`whenFinishedFunctions`](#user-content-edges)

## Functions

- [`constructor`](#user-content-constructor)

- [`extend`](#user-content-extend)

- [`addActionBuilder`](#user-content-addactionbuilder)

- [`addVertex`](#user-content-addvertex)

- [`build`](#user-content-build)

- [`startAtVertex`](#user-content-startatvertex)

- [`whenFinished`](#user-content-whenfinished)

# Definitions

## `vertices`
(array): The internal array of vertices captured by this builder.

## `edges`
(any): The internal array of edges captured by this builder.

## `source`
(any): The source vertex name to construct the graph with when `build`ing.

## `actionBuilderFunctions`
(any): An array of functions that register actions. To be used when constructing the graph on `build`.

## `whenFinishedFunctions`
(any): An array of functions that register callbacks when the traversal is finished. To be used when constructing the graph on `build`.

## `constructor`
Creates a new `Builder`.

Example:
```javascript
var builder = new Flow.Builder();
```

## `extend`
Paramters:
- `object:prototypeFragment`, a map of properties which should be extended onto a new subclass of `Builder`.

Returns a new Type which subclasses `Builder` using the given prototype fragment.

Example:
```javascript
var CountingFlowBuilder = Flow.Builder.extend({
    initialize: function (n) {
        for (var i = 1; i <= n; i++) {
            this.addCountStep(i, n);
        }
        this.startAtVertex('v1')
            .addActionBuilder(function (flow, payload) {
                // ... return some action
            }).whenFinished(functon () {
                console.log('Finished!');
            });
    },
    
    addCountStep: function (i, n) {
        var vertexName = 'v' + i;
        var nextVertex = (i === n) ? undefined : 'v' + (i + 1);
        return this.addVertex({ name: vertexName, next: nextVertex });
    },
});
```

## `addActionBuilder`
Parameters:
- `function:actionBuilderFn`, a callback function that acepts 2 parameters (`Flow:flow`, `any:payload`) and returns an `Action`.

Returns `this`.

Registers a callback function which returns an action. This function will be called by `Flow`s when traversing a vertex.

Example:
```javascript
builder.addActionBuilder(function (flow, payload) {
    return new SomeAction({
        flow: flow,
        payload: payload,
    });
});
```

## `addVertex`
Parameters:
- `object:options`, the parameters for this vertex. Two options are recognized: `name` (required) and `next` (optional).
- `any:payload`, the payload of this vertex.

Returns `this`.

Registers a vertex which will be added to the constructed `Graph` and `Flow` on `build`.

Example:
```javascript
builder.addVertex({ name: 'v1', next: 'v2' });
```

The value of the `next` option determines what edge(s) will be constructed for this vertex:

- `undefined` will make this vertex a sink - no edge will lead from it.

- A `string` will be interpreted as the name of the next vertex, creating an edge from this vertex's name to the next vertex name.

- An `object` will be interpreted as a map of possible next vertex names to choice functions which will be used to decide if that edge will be taken on `next`.

To demonstrate the `next` option as a multi-edge description, consider the following:

```javascript
builder.addVertex({ name: 'auth_start', next: {
    login: function (choiceType) {
        return choiceType === 'login';
    },
    signup: function (choiceType) {
        return choiceType === 'signup';
    },
    cancel: function (choiceType) {
        return true;
    },
}});

flow = builder.build();
flow.start();
flow.next(choiceType);
```

We have added a single vertex, `auth_start`, with 3 possible edges leading away from it Each has a choice function. When we call `next` on the flow, we can pass it parameters which will be forwarded to our choice functions. The first function from our described edges to return `true` is the edge we will take. If no edge returns `true`, this vertex is considered a sink and traversal stops.

## `build`

Returns a `Flow` using all the data provided in previous calls from `addVertex`, `addActionBiulder`, `whenFinished`, and `startAdVertex`. Call `build` once the builder has been loaded with the data and callbacks it needs.

Example:
```javascript
var flow = builder.addVertex({ name: 'v1', next: 'v2')
    .addVertex({ name: 'v2' })
    .startAtVertex('v1')
    .addActionBuilder(function (flow, payload) { ... })
    .whenFinished(function () { ... })
    .build();
```

## `startAtVertex`
Parameters:
- `string:sourceVertexName`, the name of the vertex to use as the `Graph` source on `build`.

Returns `this`.

Example:
```javascript
builder.startAtVertex('v1');
```

## `whenFinished`
Parameters:
- `function:whenFinishedFunction`, a callback function that is triggered when a flow's traversal finishes.

Returns `this`.

Registers a callback function which returns an action. This function will be called by `Flow`s when traversal is finished. Multiple functions may be registered.

Example:
```javascript
builder.whenFinished(function () {
    console.log('Finished traversal!');
});
```
