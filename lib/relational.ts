/** 
 * TODO: Implement

 * Relational library deals with fetching multiple resources in one query.
 * Many resources are treated as one "compound" resource in a pseudo-relational query.
 * 
 * Components:
 * - An array of resources to transact on
 * - Instructions on how to combine the resources into a single compound object
 * - Instructions on when to allow/deny the transaction overall, omit steps in the DAG, etc.
 *
 * Steps:
 * 1) Evaluate all preflight requirements first
 * 2) If lazy evaluation parameters are provided, try to populate the dependencies of each
 *    node in the DAG based on the results of previous requests
 * 3) Continue or stop the transaction based on the requirements set on every node
 * 4) Combine the resources
 */
