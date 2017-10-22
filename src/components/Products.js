import React from 'react';
import { Grid, PageHeader, Button, Table, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import { ModalFormProducts } from './Modals/ModalForm';
import Client from './Helpers';

class Products extends React.Component {

	//initialising
	constructor() {
		super();
		this.state  = {
			products: [],
			showModalCreate: false,

			product: {
				id: '',
				name: '',
				price: ''
			},


			validate: {
				name: null,
				price: null,
			}
		}

		this.showModalCreate = this.showModalCreate.bind(this);
		this.closeModalCreate = this.closeModalCreate.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.createProduct = this.createProduct.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.editProduct = this.editProduct.bind(this);
	}

	componentDidMount() {
		this.getProducts();
	}
	
	getProducts() {
		Client.getData('products', (responseData) => {
			this.setState({ products: responseData })
		});
	}

	showModalCreate() {
		this.setState({
			showModalCreate: true,
			product: {
				id: '',
				name: '',
				price: 0
			}
		})
	}

	closeModalCreate() {
		this.setState({
			showModalCreate: false
		})
	}

	//handle click on edit button 
	
	showModalEdit(id) {
		const products = this.state.products;
		if (id) {
			const product = products.filter(function(product) {
  			return product.id === id;
			});
			this.setState({
				showModalEdit: true,
				product: {
					id: product[0].id,
					name: product[0].name,
					price: product[0].price
				}
			})
		}
	}

	closeEditModal() {
		this.setState({
			showModalEdit: false
		})
	}

	handleInput(e) {
		let name = e.target.name, 
				value = e.target.value,
				newState = this.state.product;
		newState[name] = e.target.value;
		this.setState({...newState});
	}

	validate(data, callback) {
		let error = false;
		let validate = this.state.validate;
    if (!data.name || data.name.trim().length  === 0) {
    	error = true;
    	validate.name = 'error';
    } else {
    	validate.name = null;
    }

    if (!(data.price + '') || (data.price + '').trim().length === 0) {
    	error = true;
    	validate.price = 'error'
    } else {
    	validate.price = null
    }
    this.setState({...validate})

    callback(error);
  }


	createProduct() {
		const productName = this.state.product.name,
					productPrice = this.state.product.price,
					newProduct = {
						// 'id': productId,
						'name' : productName,
						'price': productPrice
					};
				
		//validate data and if validate succesful - post new product to database
		this.validate(newProduct, (validateErrors) => {
			//check no errors here
			if (!validateErrors) {
				this.setState({ 
						showModalCreate: false 
					});
				// POST newproduct to database
				fetch('/api/products/', {
				  method: 'POST',
				  headers: {
				    'Accept': 'application/json',
				    'Content-Type': 'application/json',
				  },
				  body: JSON.stringify(newProduct)
				})
					.then(() => this.getProducts());
			} 
		});
	}
	
	editProduct() {
		const productName = this.state.product.name,
					productPrice = this.state.product.price,
					productId = this.state.product.id;

		let data = {
			'id': productId,
			'name': productName,
			'price': productPrice
		}

		this.validate(data, (validateErrors) => {
			if (!validateErrors) {
				this.setState({ showModalEdit: false });
				fetch(`/api/products/${data.id}`, {
			    method: 'PUT',
			    headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },
			    body: JSON.stringify(data),
		  	})
		  	.then(() => this.getProducts());
			}		
		});
	}

	removeProduct(id) {
		const products = this.state.products;
		if (id) {
			const product = products.filter(function(product) {
  			return product.id === id;
  		})
  		fetch(`/api/products/${(product[0].id)}`, {
			    method: 'DELETE',
			    headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },
			    body: JSON.stringify(...product),
		  	})
		  .then(()=> this.getProducts());

		}
	}

	render() {
		let productsList = this.state.products.map((product) => (
				<tr key={product.id}>
					<td>{product.id}</td>
					<td>{product.name}</td>
					<td>{product.price}</td>
					<td>
						<Button onClick={() => this.showModalEdit(product.id)}>edit</Button>
						<Button onClick={() => this.removeProduct(product.id)}>remove</Button>
					</td>
				</tr>
			))
		return(
			<div className="container">
				<Grid>
					<PageHeader>Products List<Button onClick={this.showModalCreate}>Create</Button></PageHeader>
					<Table responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{productsList}
						</tbody>
					</Table>
				</Grid>
				<ModalFormProducts
					title={'Create New Product'}
					modalType={'Create'}
					showModal={this.state.showModalCreate} 
					hideModal={this.closeModal} 
					validate={this.state.validate}
					product = {this.state.product}
					handleInput={this.handleInput}
					onSubmit={this.createProduct}
					onClose={this.closeModalCreate}
					/>
				<ModalFormProducts
					title={'Edit Product'}
					modalType={'Edit'}
					showModal={this.state.showModalEdit} 
					hideModal={this.closeModal} 
					validate={this.state.validate}
					product = {this.state.product}
					handleInput={this.handleInput}
					onSubmit={this.editProduct}
					onClose={this.closeEditModal}
					/>
			</div>
		)
	}
}

export default Products;