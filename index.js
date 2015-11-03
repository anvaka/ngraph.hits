/**
 * Computes hubs & authorities rank for a graph.
 *
 * @see https://en.wikipedia.org/wiki/HITS_algorithm for more details
 */
module.exports = hits;

/**
 * @param {ngraph.graph} graph instance to work on.
 * @param {number} [epsilon=1e-8] - convergence criteria.
 */
function hits(graph, epsilon) {
  if (typeof epsilon !== 'number') epsilon = 1e-8;
  var hitsGraph = initialize(graph);
  var hitsNodes = hitsGraph.nodes;
  var done = true;
  do {
    var authorityChange = computeAuthorities(hitsNodes);
    var hubChange = computeHubs(hitsNodes);
    done = authorityChange <= epsilon && hubChange <= epsilon;
  } while (!done);

  return convertToSourceGraph(graph, hitsGraph);
}

function convertToSourceGraph(originalGraph, hitsGraph) {
  var result = Object.create(null);
  var nodeIdToIndex = hitsGraph.nodeIdToIndex;
  var hitsNodes = hitsGraph.nodes;

  originalGraph.forEachNode(addHits);

  return result;

  function addHits(node) {
    var hitsNode = hitsNodes[nodeIdToIndex[node.id]];
    result[node.id] = {
      authority: hitsNode.authority,
      hub: hitsNode.hub
    };
  }
}

function initialize(graph) {
  var hitsNodes = [];
  var totalNodes = graph.getNodesCount();
  if (totalNodes === 0) {
    return {
      nodes: [],
      nodeIdToIndex: []
    }; // degenerate case of empty graph
  }

  var nodeIdToIndex = Object.create(null);
  var idx = 0;
  graph.forEachNode(addHitsNode);
  graph.forEachLink(addHitsLinks);

  return {
    nodes: hitsNodes,
    nodeIdToIndex: nodeIdToIndex,
  };

  function addHitsNode(node) {
    var hitsNode = new HitsNode(1);
    hitsNodes.push(hitsNode);
    nodeIdToIndex[node.id] = idx++;
  }

  function addHitsLinks(link) {
    var fromIdx = nodeIdToIndex[link.fromId];
    var fromNode = hitsNodes[fromIdx];
    var toIdx = nodeIdToIndex[link.toId];
    var toNode = hitsNodes[toIdx];

    fromNode.outEdges.push(toIdx);
    toNode.inEdges.push(fromIdx);
  }
}

function computeHubs(nodes) {
  var maxHub = -1;
  for (var i = 0; i < nodes.length; ++i) {
    var node = nodes[i];
    var outEdges = node.outEdges;
    var hub = 0;
    for (var j = 0; j < outEdges.length; ++j) {
      hub += nodes[outEdges[j]].authority;
    }
    if (hub > maxHub) maxHub = hub;
    node.prevhub = node.hub;
    node.hub = hub;
  }

  return normalize(nodes, maxHub, 'hub');
}

function computeAuthorities(nodes) {
  var maxAuthority = -1;
  for (var i = 0; i < nodes.length; ++i) {
    var node = nodes[i];
    var inEdges = node.inEdges;
    var authority = 0;
    for (var j = 0; j < inEdges.length; ++j) {
       authority += nodes[inEdges[j]].hub;
    }
    if (authority > maxAuthority) maxAuthority = authority;
    node.prevauthority = node.authority;
    node.authority = authority;
  }

  return normalize(nodes, maxAuthority, 'authority');
}

function normalize(nodes, norm, attribute) {
  var dx = 0;
  var prevAttribute = 'prev' + attribute;
  for (var i = 0; i < nodes.length; ++i) {
    var node = nodes[i];
    node[attribute] /= norm;
    dx += Math.abs(node[attribute] - node[prevAttribute]);
  }

  return dx;
}

function HitsNode(norm) {
  // `prev` attribute is used only to compute exit criteria. This probably could
  // be done better to save more space.
  this.prevauthority = this.authority = norm;
  this.prevhub = this.hub = norm;
  this.inEdges = [];
  this.outEdges = [];
}
