import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Customers from './Customers';
import Products from './Products';

const App = () => {
	return (
    <BrowserRouter>
      <div>
        <Header />
        <Route exact path="/" component={Customers}></Route>
        <Route path="/customers" component={Customers}></Route>
        <Route path="/products" component={Products}></Route>
      </div>
    </BrowserRouter>
	)
}

export default App;