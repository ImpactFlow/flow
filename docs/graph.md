# Graph

> [lib/graph.js](https://github.com/kgarsjo/flow/blob/master/lib/graph.js)

A `Graph` is the data structure over which a `Flow` traverses. `Graph`s are defined in the mathematical form as a set of both vertices `V` and edges `E`, where `e ∈ E` connects two vertices in `V`. 

`Graph`s here are considered directed graphs (one-way edges) with one unique source vertex (starting point). The graph also recognizes sink vertices, a.k.a. vertices that trap a traverser because they have no departing edges.

## Properties

- [`vertices`](#user-content-vertices)

- [`edges`](#user-content-edges)

- [`source`](#user-content-source)

## Functions

- [`constructor`](#user-content-constructor)

- [`extend`](#user-content-extend)

- [`getAllEdges`](#user-content-getalledges)

- [`getAllEdgeTargets`](#user-content-getalledgetargets)

- [`getAllSinkNames`](#user-content-getallsinknames)

- [`getAllTargets`](#user-content-getalltargets)

- [`getAllVertexNames`](#user-content-getallvertexnames)

- [`getAllVertices`](#user-content-getallvertices)

- [`getNextVertex`](#user-content-getnextvertex)

- [`getSourceName`](#user-content-getsourcename)

- [`getSourceVertex`](#user-content-getsourcevertex)

- [`getVertexNamed`](#user-content-getvertexnamed)

- [`hasVertexNamed`](#user-content-hasvertexnamed)

- [`validate`](#user-content-validate)

# Definitions

## `vertices`
(array): The internal list of vertices in this `Graph`.

## `edges`
(array): The internal list of edges in this `Graph`.

## `source`
(string): The name of the source vertex for this `Graph`.

## `constructor`
Parameters:
- `array:vertices`, an array of vertices to use in a `Graph`.
- `array:edges`, an array of edges to use in a `Graph`.
- `string:source`, the source vertex name used when starting the `Graph`.

Creates a new `Graph`. Rather than constructing one by hand, most use cases will favor using a `Builder` to attach a graph to a flow.

Example:
```javascript
var vertices = [...];
var edges = [...];
var source = 'v1';
var graph = new Flow.Graph(vertices, edges, source);
```

## `extend`
Paramters:
- `object:prototypeFragment`, a map of properties which should be extended onto a new subclass of `Graph`.

Returns a new Type which subclasses `Graph` using the given prototype fragment.

Example:
```javascript
var CustomGraph = Flow.Graph.extend({
    getVertexNamed: function (name) {
        return this.vertices.find(function (vertex) {
            return vertex.getName() === name;
        });
    },
});
```

## `getAllEdges`
Returns the array of edges this graph encapsulates.

Example:
```javascript
var edges = graph.getAllEdges();
```

## `getAllEdgeTargets`
Returns an array of every vertex name touched by an edge for this graph.

Example:
```javascript
var edgeTargets = graph.getAllEdgeTargets();
// ['v1', 'v2', v3', v4', ... ]
```

## `getAllSinkNames`
Returns an array of every vertex name that doesn't have an edge leading to a new vertex. These vertices are considered "sinks" and will end the traversal once they are passed.

Example:
```javascript
var sinkNames = graph.getAllSinkNames();
// ['last_vertex_1', 'last_vertex_2', ... ]
```

## `getAllTargets`
Returns an array of every vertex name touched by an edge for this graph, including the source vertex.

Example:
```javascript
var allTargets = graph.getAllTargets();
```

## `getAllVertexNames`
Returns an array containing every name of a vertex know to the graph.

Example:
```javascript
var vertexNames = graph.getAllVertexNames();
```

## `getAllVertices`
Returns an array of `Vertex` instances known to the graph.

Example:
```javascript
var vertices = graph.getAllVertices();
```

## `getNextVertex`
Parameters:
- `Vertex:vertex`, the vertex whose next to find.
- `any:options`, the optional parameters to aid in the choice of multiple edges.

Returns the next vertex from the given vertex, using the options to aid choice if required. If no next vertex exists, returns `undefined`.

Every edge for this vertex is inspected and the choice function for that edge is called with the given options. The first edge to return `true` from its choice function is the edge used.

Example:
```javascript
var nextVertex = graph.getNextVertex(currentVertex, { choiceHelpers: 'foo bar baz' });
```

## `getSourceName`
Returns the string name of the source vertex for this graph.

Example:
```javascript
var sourceName = graph.getSourceName();
```

## `getSourceVertex`
Returns the vertex instance that is the source vertex for this graph.

Example:
```javascript
var sourceVertex = graph.getSourceVertex();
```

## `getVertexNamed`
Parameters:
- `string:name`, the name of the vertex to find.

Returns the first vertex known to this graph whose name matches the given name. If none is found returns `undefined`.

Example:
```javascript
var vertex = graph.getVertexNamed('foo_vertex');
```

## `hasVertexNamed`
Returns true if the graph knows any vertex whose name matches the given name. Returns false otherwise.

Example:
```javascript
var hasVertex = graph.hasVertexNamed('foo_vertex');
```

## `validate`
Throws an exception if the graph as described is invalid in any way, such as:
- Edges describing vertices that do not exist
- Source describing a vertex that does not exist

Example:
```javascript
try {
    graph.validate();
} catch (e) {
    console.log('Invalid!');
)
```
