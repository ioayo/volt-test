import React from 'react';
import { Grid, PageHeader, Button, Table, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import ModalForm from './Modals/ModalForm';
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
	}

	componentDidMount() {
		this.getProducts();
	}
	
	getProducts() {
		Client.getData('products', (responseData) => {
			this.setState({ products: responseData })
		});
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
			</div>
		)
	}
}

export default Products;