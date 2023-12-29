/**
 * is-authenticated policy
 */

export default (policyContext, ...rest) => {
	console.log("is-authenticated policy group admin", policyContext, rest)
	return policyContext.state.isAuthenticated || false
}
