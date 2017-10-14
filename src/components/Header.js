import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = props => {
	return (
		<Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">Invoice App</Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
          <LinkContainer to="/customers">
            <NavItem>Customers</NavItem>
          </LinkContainer>
          <LinkContainer to="/products">
            <NavItem>Customers</NavItem>
          </LinkContainer>
      </Nav>
     </Navbar>
	)
}

export default Header;