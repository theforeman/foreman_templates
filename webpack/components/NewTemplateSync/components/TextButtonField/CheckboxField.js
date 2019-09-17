import React from 'react';
import { Checkbox } from 'patternfly-react';
import PropTypes from 'prop-types';

const CheckboxField = ({ input, item, disabled }) => (
  <Checkbox {...input} disabled={disabled} checked={input.value} />
);

CheckboxField.propTypes = {
  input: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default CheckboxField;
