interface ErrorPageProps {}

const ErrorPage = (props: ErrorPageProps) => {
	console.log("ErrorPage props", props)

	return (
		<div>
			<h1>Error happened</h1>
		</div>
	)
}

export default ErrorPage
