import React from 'react';
import { Grid, PageHeader, Button, Table, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import ModalForm from './Modals/ModalForm';

class Customers extends React.Component {
	//initialising
	constructor() {
		super();
		this.state  = {
			customers: [],
			showModalCreate: false,

			customer: {
				// id: '',
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
		this.closeModalCreate = this.closeModalCreate.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.createCustomer = this.createCustomer.bind(this);
		this.showModalEdit = this.showModalEdit.bind(this);
		this.removeCustomer = this.removeCustomer.bind(this);
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
			customer: {
				// id: '',
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



	removeCustomer(id) {
		const customers = this.state.customers;

		if (id) {
			const customer = customers.filter(function(customer) {
  			return customer.id === id;
  		})
  		fetch(`/api/customers/${(customer[0].id)}`, {
			    method: 'DELETE',
			    headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },
			    body: JSON.stringify(...customer),
		  	})
		  .then(()=> this.getCustomers());

		}
	}

	//handle create modal close
	closeModalCreate() {
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
	}

	//validate forms
	validate(data, callback) {
		let error = false;
		let validate = this.state.validate;
		console.log(validate);
    if (!data.name || data.name.trim().length  === 0) {
    	error = true;
    	validate.name = 'error';
    } else {
    	validate.name = null;
    }

    if (!data.address || data.address.trim().length === 0) {
    	error = true;
    	validate.address = 'error'
    } else {
    	validate.address = null
    }

    if (!data.phone || data.phone.trim().length === 0) {
    	error = true;
    	validate.phone = 'error'
    } else {
    	validate.phone = null
    }
    this.setState({...validate})

    callback(error);
  }

	//create customer from modal
	createCustomer() {
		// let customerId = 1;
		// if (this.state.customers.length > 0) {
		// 	customerId = this.state.customers.reduce(function(prev, current) {
  //   		return (prev.id > current.id) ? prev : current
		// 	}).id + 1;
		// }
		const customerName = this.state.customer.name,
					customerAddress = this.state.customer.address,
					customerPhone = this.state.customer.phone,
					newCustomer = {
						// 'id': customerId,
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
		  	then(() =>this.getCustomers());
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
						<Button onClick={() => this.removeCustomer(customer.id)}>remove</Button>
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

				<ModalForm 
					title={'Create New Customer'}
					modalType={'Create'}
					showModal={this.state.showModalCreate} 
					hideModal={this.closeModal} 
					validate={this.state.validate}
					customer = {this.state.customer}
					handleInput={this.handleInput}
					onSubmit={this.createCustomer}
					onClose={this.closeModalCreate}
					/>
				
				<ModalForm
					title={'Edit Customer'}
					modalType={'Edit'}
					showModal={this.state.showModalEdit}
					hideModal={this.closeModal}
					validate={this.state.validate}
					customer={this.state.customer}
					handleInput={this.handleInput}
					onSubmit={this.editCustomer}
					onClose={this.closeEditModal}
				/>



				
			</div>
		)
	}
}

export default Customers;