import React from 'react';
import { render } from 'react-dom';

import 'react-select/dist/react-select.css';

class App extends React.Component {
	componentDidMount() {
		fetch('/api/customers')
			.then(response => response.json())
			.then(responseData => console.log(responseData))
	}
	render() {
		return (
			<div>kek</div>	
		)
	}
}
render(<App />, document.getElementById('app-root'));
