import React from 'react';
import { Grid, PageHeader, Button, Table, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import ModalForm from './Modals/ModalForm';
import Client from './Helpers';

class Customers extends React.Component {
	//initialising
	constructor() {
		super();
		this.state  = {
			customers: [],
			showModalCreate: false,

			customer: {
				id: '',
				phone: '',
				name: '',
				address: ''
			},


			validate: {
				name: null,
				phone: null,
				address: null
			}

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
		Client.getData('customers', (responseData) => {
			this.setState({ customers: responseData })
		});
	}

	//handle click on create button
	showModalCreate() {
		this.setState({
			showModalCreate: true,
			customer: {
				id: '',
				name: '',
				address: '',
				phone: ''
			}
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
				customer: {
					id: customer[0].id,
					name: customer[0].name,
					address: customer[0].address,
					phone: customer[0].phone
				}
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
				newState = this.state.customer;
		newState[name] = e.target.value;
		this.setState({...newState});
		console.log(newState[name]);
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
		const customerName = this.state.customer.name,
					customerAddress = this.state.customer.address,
					customerPhone = this.state.customer.phone,
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
					.then(() => this.getCustomers());
			} 
		});
	}


	editCustomer() {
		const customerName = this.state.customer.name,
					customerAddress = this.state.customer.address,
					customerPhone = this.state.customer.phone,
					customerId = this.state.customer.id;

		let data = {
			'id': customerId,
			'name': customerName,
			'address': customerAddress,
			'phone': customerPhone
		}

		this.validate(data, (validateErrors) => {
			if (!validateErrors) {
				this.setState({ showModalEdit: false });
				fetch(`/api/customers/${data.id}`, {
			    method: 'PUT',
			    headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },
			    body: JSON.stringify(data),
		  	}).
		  	then(() =>Client.getData());
			}		
		});
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
			<div>
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

				<ModalForm showModal={this.state.showModalCreate} 
							 hideModal={this.closeCreateModal} 
							 validate={this.state.validate}
							 customer = {this.state.customer}
							 handleInput={this.handleInput}
							 createCustomer={this.createCustomer}
							 onClick={this.closeCreateModal}
					/>


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