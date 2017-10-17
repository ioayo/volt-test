import React from 'react';

import { Button, Table, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

class ModalForm extends React.Component {
  render() {

    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <FormGroup validationState={this.props.validate.name}>
            <ControlLabel>Name</ControlLabel>
            <FormControl 
              type="text"
              name="name"
              value={this.props.customer.name}
              onChange={this.props.handleInput}
              placeholder="Enter name"
            />
          </FormGroup>
          <FormGroup validationState={this.props.validate.address}>
            <ControlLabel>Address</ControlLabel>
            <FormControl 
              type="text"
              name="address"
              value={this.props.customer.address}
              onChange={this.props.handleInput}
              placeholder="Enter name"
            />
          </FormGroup >
          <FormGroup validationState={this.props.validate.phone}>
            <ControlLabel>Phone</ControlLabel>
            <FormControl 
              type="text"
              name="phone"
              value={this.props.customer.phone}
              onChange={this.props.handleInput}
              placeholder="Enter name"
            />
          </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.props.onSubmit}>{this.props.modalType}</Button>
            <Button onClick={this.props.onClose}>Cancel</Button>
          </Modal.Footer>
        </Modal>
    )
  }
}

export default ModalForm;
