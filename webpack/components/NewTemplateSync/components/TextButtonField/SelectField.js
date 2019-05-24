import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'patternfly-react';
import BlankOption from './BlankOption';

const SelectField = ({ input, blank, item, disabled }) => (
  <FormControl {...input} componentClass="select" disabled={disabled}>
    <BlankOption blank={blank} />
    {item.selection.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </FormControl>
);

SelectField.propTypes = {
  input: PropTypes.object.isRequired,
  blank: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default SelectField;
