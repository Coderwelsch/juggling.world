/**
 * is-authenticated policy
 */

export default (policyContext) => {
	return policyContext.state.isAuthenticated || false
}
