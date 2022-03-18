import React from 'react';
import {
	Route,
	Switch,
	useRouteMatch,
} from "react-router-dom";
import LoanRegister from './containers/LoanRegister';
function LoanContainer () {
	let { url, path } = useRouteMatch();
	return (
		<div>
		<Switch>
        <Route path={`${path}/register`}>
			<LoanRegister />
        </Route>
			</Switch>
		</div>
	)
}
export default LoanContainer;