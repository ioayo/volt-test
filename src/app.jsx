import React from 'react';
import { render } from 'react-dom';

import 'react-select/dist/react-select.css';

class App extends React.Component {
	constructor(props) {
		super();
		this.state = {
			ok: 'ok'
		}
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.setState({ok: 'clicked'})
	}

	componentDidMount() {
		fetch('/api/customers')
			.then(response => response.json())
			.then(responseData => console.log('its work',responseData))
	}
	
	render() {
		return (
			<div onClick={this.handleClick}>ss</div>	
		)
	}
}
render(<App />, document.getElementById('app-root'));
