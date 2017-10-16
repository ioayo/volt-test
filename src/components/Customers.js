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


			validateName: null,

		}
		this.showModalCreate = this.showModalCreate.bind(this);
		this.closeCreateModal = this.closeCreateModal.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.createCustomer = this.createCustomer.bind(this);
		this.showModalEdit = this.showModalEdit.bind(this);
		this.showModalRemove = this.showModalRemove.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.editCustomer = this.editCustomer.bind(this);
	}

	
	componentDidMount() {
		this.getCustomers();
	}

	getCustomers() {
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
	
	//handle click on edit button 
	
	showModalEdit(id) {
		const customers = this.state.customers;
		if (id) {
			const customer = customers.filter(function(customer) {
  			return customer.id === id;
			});

			this.setState({
				showModalEdit: true,
				customerId: customer[0].id,
				customerName: customer[0].name,
				customerAddress: customer[0].address,
				customerPhone: customer[0].phone,
			})
		}
	}



	showModalRemove(id) {
		console.log(id);
	}

	//handle create modal close
	closeCreateModal() {
		this.setState({
			showModalCreate: false,
		})
	}

	//handle edit modal close 
	
	closeEditModal() {
		this.setState({
			showModalEdit: false
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

	//validate forms
	validate(data, callback) {
		let error = false;
    if (!data.name || data.name.trim().length  === 0) {
    	error = true;
    	this.setState({ validateName: 'error' })
    } else {
    	this.setState({ validateName: null })
    }

    if (!data.address || data.address.trim().length === 0) {
    	error = true;
    	this.setState({ validateAddress: 'error' })
    } else {
    	this.setState({ validateAddress: null })
    }

    if (!data.phone || data.phone.trim().length === 0) {
    	error = true;
    	this.setState({ validatePhone: 'error' })
    } else {
    	this.setState({ validatePhone: null })
    }

    callback(error);
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
					};
				
		//validate data and if validate succesful - post new customer to database
		//
		this.validate(newCustomer, (validateErrors) => {
			//check no errors here
			if (!validateErrors) {

				this.setState({ 
						showModalCreate: false 
					});

				// POST newCustomer to database
				fetch('/api/customers/', {
				  method: 'POST',
				  headers: {
				    'Accept': 'application/json',
				    'Content-Type': 'application/json',
				  },
				  body: JSON.stringify(newCustomer)
				})
				this.getCustomers();
			} 
		});
	}


	editCustomer() {

		const customerName = this.state.customerName,
					customerAddress = this.state.customerAddress,
					customerPhone = this.state.customerPhone,
					customerId = this.state.customerId;

		let data = {
			'id': customerId,
			'name': customerName,
			'address': customerAddress,
			'phone': customerPhone
		}

		this.validate(data, (validateErrors) => {
			if (!validateErrors) {
				this.setState({ showModalEdit: false });
				console.log(JSON.stringify(data));
				fetch(`/api/customers/${data.id}`, {
			    method: 'PUT',
			    headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },
			    body: JSON.stringify(data),
		  	});
		  	
			}		
		});
		this.getCustomers();
	}

	


	render() {
		let customersList = this.state.customers.map((customer) => (
				<tr key={customer.id}>
					<td>{customer.id}</td>
					<td>{customer.name}</td>
					<td>{customer.address}</td>
					<td>{customer.phone}</td>
					<td>
						<Button onClick={() => this.showModalEdit(customer.id)}>edit</Button>
						<Button onClick={() => this.showModalRemove(customer.id)}>remove</Button>
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
          <FormGroup validationState={this.state.validateName}>
          	<ControlLabel>Name</ControlLabel>
          	<FormControl 
							type="text"
							name="customerName"
							value={this.state.customerName}
							onChange={this.handleInput}
							placeholder="Enter name"
          	/>
          </FormGroup>
          <FormGroup validationState={this.state.validateAddress}>
          	<ControlLabel>Address</ControlLabel>
          	<FormControl 
							type="text"
							name="customerAddress"
							value={this.state.customerAddress}
							onChange={this.handleInput}
							placeholder="Enter name"
          	/>
          </FormGroup >
          <FormGroup validationState={this.state.validatePhone}>
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


				<Modal show={this.state.showModalEdit} onHide={this.closeEditModal}>
					<Modal.Header closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <FormGroup validationState={this.state.validateName}>
          	<ControlLabel>Name</ControlLabel>
          	<FormControl 
							type="text"
							name="customerName"
							value={this.state.customerName}
							onChange={this.handleInput}
							placeholder="Enter name"
          	/>
          </FormGroup>
          <FormGroup validationState={this.state.validateAddress}>
          	<ControlLabel>Address</ControlLabel>
          	<FormControl 
							type="text"
							name="customerAddress"
							value={this.state.customerAddress}
							onChange={this.handleInput}
							placeholder="Enter name"
          	/>
          </FormGroup >
          <FormGroup validationState={this.state.validatePhone}>
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
            <Button bsStyle="primary" onClick={this.editCustomer}>Edit</Button>
            <Button onClick={this.closeEditModal}>Cancel</Button>
          </Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export default Customers;