import React from 'react';
import { FormControl } from 'patternfly-react';
import PropTypes from 'prop-types';

const InputField = ({ input, disabled }) => (
  <FormControl {...input} type="text" disabled={disabled} />
);

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default InputField;
