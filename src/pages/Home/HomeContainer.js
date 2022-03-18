import React from 'react';
import '../../styles/home.scss'
class HomeContainer extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			widthSidebar: 268
		}
	}
	render() {
		const { widthSidebar } = this.state;
		return (
			<>
			HOME
			</>
		)
	}
}
export default HomeContainer;