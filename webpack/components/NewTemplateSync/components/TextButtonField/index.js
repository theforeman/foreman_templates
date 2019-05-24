import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import RenderField from './RenderField';

const TextButtonField = ({
  item = {},
  label,
  name,
  className,
  inputClassName,
  blank,
  buttonAttrs,
  fieldSelector,
  validate,
  disabled,
  fieldRequired,
  tooltipHelp,
}) => (
  <Field
    name={name}
    label={label}
    fieldSelector={fieldSelector}
    tooltipHelp={tooltipHelp}
    component={RenderField}
    buttonAttrs={buttonAttrs}
    blank={blank}
    item={item}
    disabled={disabled}
    validate={item.validate}
    fieldRequired={fieldRequired}
  />
);

TextButtonField.propTypes = {
  item: PropTypes.object,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  blank: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  buttonAttrs: PropTypes.shape({
    buttonText: PropTypes.node,
    buttonAction: PropTypes.func,
  }).isRequired,
  fieldSelector: PropTypes.func,
  validate: PropTypes.array,
  disabled: PropTypes.bool,
  fieldRequired: PropTypes.bool,
  tooltipHelp: PropTypes.node,
};

TextButtonField.defaultProps = {
  blank: { label: 'Choose one...', value: '' },
  className: '',
  inputClassName: 'col-md-6',
  validate: [],
  disabled: false,
  fieldRequired: false,
  tooltipHelp: null,
  fieldSelector: () => 'text',
  item: {},
};

export default TextButtonField;
