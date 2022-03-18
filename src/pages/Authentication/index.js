import React from 'react';
import {
	Route,
	Switch,
	useRouteMatch,
	useParams,
	BrowserRouter as Router,
	Link
} from "react-router-dom";
function Sub() {

	let { id } = useParams();

	return (
		<div>
		<h3>{id}</h3>
		</div>
	);
}
function AuthenticationContainer () {
	let { path, url } = useRouteMatch();
	return (
		<div>
			Authentication
			<Router>
				<ul>
					<li>
						<Link to={`/auth/sub1`}>Sub1</Link>
					</li>
					<li>
					<Link to={`/auth/sub2`}>Sub2</Link>
					</li>
				</ul>
				<Switch>
					<Route path={'/auth/:id'}>
						<Sub />
					</Route>
				</Switch>
			</Router>
		</div>
  )
}
export default AuthenticationContainer;