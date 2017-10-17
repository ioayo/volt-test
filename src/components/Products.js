import React from 'react';
import { Grid, PageHeader, Button, Table, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import ModalForm from './Modals/ModalForm';

class Products extends React.Component {
	render() {
		return(
			<div className="container">
				<Grid>
					<PageHeader>Products List</PageHeader>
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