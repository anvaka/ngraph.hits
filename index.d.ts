declare module "ngraph.hits" {
  import { Graph, NodeId } from "ngraph.graph";

  /**
   * Graph node score
   */
  export interface NodeScore {
    /**
     * Estimates the value of a node.
     */
    authority: number;

    /**
     * Estimates the value of outgoing links from a node.
     */
    hub: number;
  }

  /**
   * HITS algorithm analysis result, consisting of one {@link NodeScore} for each graph node.
   */
  export interface Hits {
    [node: NodeId]: NodeScore;
  }

  /**
   * Hubs and authorities (HITS) algorithm for [`ngraph.graph`](https://github.com/anvaka/ngraph.graph).
    HITS algorithm is a link analysis algorithm, which assigns each graph node two
    scores:

    - authority - estimates the value of a node
    - hub - estimates the value of outgoing links from a node

    See more details about algorithm here: [Hyperlink-Induced Topic Search](https://en.wikipedia.org/wiki/HITS_algorithm).

   * @param graph {@link Graph} instance to work on.
   * @param epsilon convergence criteria, defaults to 1e-8.
   */
  export default function hits(graph: Graph, epsilon?: number): Hits;
}
