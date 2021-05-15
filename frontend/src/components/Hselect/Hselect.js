/****************************************************************************

 WARPER DO REACT-SELECT

*****************************************************************************/

import React, { Component } from 'react';
import './hselect.scss'
import Select from 'react-select';

export default class SingleSelect extends Component{
  state = {
    selectedOption: null,
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.change(selectedOption)
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <Select
            className="basic-single"
            value={selectedOption}
            onChange={this.handleChange}
            options={this.props.data}
            placeholder={this.props.name}
      />
    );
  }
}