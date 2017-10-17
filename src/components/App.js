import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import Header from './Header';
import Customers from './Customers';
import Products from './Products';

const App = () => {
	return (
    <HashRouter>
      <div>
        <Header />
        <Route exact path="/" component={Customers}></Route>
        <Route path="/customers" component={Customers}></Route>
        <Route path="/products" component={Products}></Route>
      </div>
    </HashRouter>
	)
}

export default App;