import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Dropdown, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { getAPIData } from '../../utils/api';

const Form = styled.form`
  .ui.action.left.icon.input.parent-input-div > input {
    width: 150px;
  }

  input::-webkit-calendar-picker-indicator {
    display: none;
  }
`;

const Datalist = styled.datalist`
  color: red;
  option {
    color: red;
  }
`;

class NavbarSearchInput extends Component {
  timeout = null;
  state = {
    typeaheadData: undefined,
  };

  options = [
    { key: 'movie', text: 'Movie', value: 'movie' },
    { key: 'tv', text: 'TV Show', value: 'tv' },
  ];

  handleInputChange = () => {
    const { value } = this.input.inputRef;
    const type = this.dropdown.getSelectedItem().key;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (value) {
      setTimeout(() => {
        this.fetchTypeaheadContent(value, type);
      }, 800);
    } else {
      this.setState({ typeaheadData: undefined });
    }
  };

  fetchSelectedContent = async (inputValue, type) => {
    const arrayResponse = await getAPIData(inputValue, type, 'query');
    const firstItemOnResponse = arrayResponse[0];
    this.props.history.push(`/details/${type}/${firstItemOnResponse.id}`);
  };


  fetchTypeaheadContent = async (inputValue, type) => {
    const arrayResponse = await getAPIData(inputValue, type, 'query');
    const typeaheadData = arrayResponse.slice(0, 5);

    this.setState({ typeaheadData });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    const { value } = this.input.inputRef;
    const type = this.dropdown.getSelectedItem().key;

    if (value) {
      this.fetchSelectedContent(value, type);
      this.input.inputRef.value = '';
    }
  };

  renderDatalist = () => {
    const { typeaheadData } = this.state;

    if (typeaheadData !== undefined && typeaheadData.length > 0) {
      return (
        <Datalist id="content">
          {typeaheadData.map(({ name, title, id }) => (
            <option key={id} value={name || title} />
          ))}
        </Datalist>
      );
    }

    return null;
  };

  render() {
    const { isFetchingData } = this.props;
    const inputIcon = isFetchingData ? '' : 'search';
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input
          className="parent-input-div"
          loading={isFetchingData}
          iconPosition="left"
          ref={(ref) => {
            this.input = ref;
          }}
          action={
            <Dropdown
              button
              basic
              size="mini"
              floating
              className="white-dropdown"
              options={this.options}
              defaultValue="movie"
              ref={(ref) => {
                this.dropdown = ref;
              }}
            />
          }
        >
          <Icon name={inputIcon} />
          <input type="text" list="content" onKeyUp={this.handleInputChange} />
          {this.renderDatalist()}
          <Dropdown
            button
            basic
            size="mini"
            floating
            className="white-dropdown"
            options={this.options}
            defaultValue="movie"
            ref={(ref) => {
              this.dropdown = ref;
            }}
          />
        </Input>
      </Form>
    );
  }
}

NavbarSearchInput.propTypes = {
  isFetchingData: PropTypes.bool.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withRouter(NavbarSearchInput);
