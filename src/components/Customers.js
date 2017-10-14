import React from 'react';
import { Grid, PageHeader, Button, Table, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

class Customers extends React.Component {
	//initialising
	constructor() {
		super();
		this.state  = {
			customers: [],
			showModalCreate: false,

			customerId: '',
			customerName: '',
			customerAddress: '',
			customerPhone: '',


			validate: {
				name: null,
				address: null,
				phone: null
			}
		}
		this.showModalCreate = this.showModalCreate.bind(this);
		this.closeCreateModal = this.closeCreateModal.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.createCustomer = this.createCustomer.bind(this);
	}

	//get customers from api and set state
	componentDidMount() {
		fetch('/api/customers')
			.then(response => response.json())
			.then(responseData => this.setState({ customers: responseData }))
	}

	//handle click on create button
	showModalCreate() {
		this.setState({
			showModalCreate: true,
			customerId: '',
			customerName: '',
			customerAddress: '',
			customerPhone: '',
		})
	}
	
	//handle create modal close
	closeCreateModal() {
		this.setState({
			showModalCreate: false,
		})
	}

	//handle input from modal
	handleInput(e) {
		let name = e.target.name, 
				value = e.target.value,
				newState = this.state;
		newState[name] = e.target.value;
		this.setState(newState);
	}
	
	//create customer from modal
	createCustomer() {
		const customerName = this.state.customerName,
					customerAddress = this.state.customerAddress,
					customerPhone = this.state.customerPhone,
					customerId = this.state.customers.reduce(function(prev, current) {
    				return (prev.id > current.id) ? prev : current
					}).id + 1,
					newCustomer = {
						'id': customerId,
						'name' : customerName,
						'address': customerAddress,
						'phone': customerPhone
					},
					customers = this.state.customers;
		//add new customer to customers
		customers.splice(customers.length, 0, newCustomer);
		this.setState({ 
				customers: customers,
				showModalCreate: false
			});
	
		fetch('/api/customers/', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	'id': customerId,
				'name' : customerName,
				'address': customerAddress,
				'phone': customerPhone
		  })
		})
	}

	render() {

		console.dir(this.state.customers);

		let customersList = this.state.customers.map((customer) => (
				<tr key={customer.id}>
					<td>{customer.id}</td>
					<td>{customer.name}</td>
					<td>{customer.address}</td>
					<td>{customer.phone}</td>
					<td>
						<Button>edit</Button>
						<Button>remove</Button>
					</td>
				</tr>
			))
	
		return(
			<div className="container">
				<Grid>
					<PageHeader>Customer List<Button onClick={this.showModalCreate}>Create</Button></PageHeader>
					<Table responsive >
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Price</th>
								<th>Phone</th>
							</tr>
						</thead>
						<tbody>
							{customersList}
						</tbody>
					</Table>
				</Grid>

				<Modal show={this.state.showModalCreate} onHide={this.closeCreateModal}>
					<Modal.Header closeButton>
            <Modal.Title>Create New Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <FormGroup validationState={this.state.validate.name}>
          	<ControlLabel>Name</ControlLabel>
          	<FormControl 
							type="text"
							name="customerName"
							value={this.state.customerName}
							onChange={this.handleInput}
							placeholder="Enter name"
          	/>
          </FormGroup>
          <FormGroup validationState={this.state.validate.address}>
          	<ControlLabel>Address</ControlLabel>
          	<FormControl 
							type="text"
							name="customerAddress"
							value={this.state.customerAddress}
							onChange={this.handleInput}
							placeholder="Enter name"
          	/>
          </FormGroup>
          <FormGroup validationState={this.state.validate.phone}>
          	<ControlLabel>Phone</ControlLabel>
          	<FormControl 
							type="text"
							name="customerPhone"
							value={this.state.customerPhone}
							onChange={this.handleInput}
							placeholder="Enter name"
          	/>
          </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.createCustomer}>Create</Button>
            <Button onClick={this.closeCreateModal}>Cancel</Button>
          </Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export default Customers;