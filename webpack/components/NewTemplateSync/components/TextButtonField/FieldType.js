import React from 'react';
import PropTypes from 'prop-types';

import InputField from './InputField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';

const FieldType = ({ item, fieldSelector, input, disabled, blank }) => {
  if (!fieldSelector) {
    return <InputField input={input} disabled={disabled} />;
  }

  switch (fieldSelector(item)) {
    case 'text':
      return <InputField input={input} disabled={disabled} />;
    case 'select':
      return (
        <SelectField
          input={input}
          blank={blank}
          item={item}
          disabled={disabled}
        />
      );
    case 'checkbox':
      return <CheckboxField input={input} item={item} disabled={disabled} />;
    default:
      throw new Error(`Unknown field type ${fieldSelector(item)} for ${item}`);
  }
};

FieldType.propTypes = {
  item: PropTypes.object.isRequired,
  fieldSelector: PropTypes.func,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  blank: PropTypes.bool,
};

FieldType.defaultProps = {
  fieldSelector: null,
  disabled: false,
  blank: false,
};

export default FieldType;
