import React from 'react';
import { get } from 'lodash';
import { Field as FormikField } from 'formik';
import PropTypes from 'prop-types';

import RenderField from './RenderField';

const TextButtonField = ({
  item = {},
  label,
  name,
  className,
  inputClassName,
  blank,
  buttonText,
  buttonAction,
  fieldSelector,
  disabled,
  fieldRequired,
  tooltipHelp,
}) => (
  <FormikField
    name={name}
    render={({ field, form }) => (
      <RenderField
        label={label}
        fieldSelector={fieldSelector}
        tooltipHelp={tooltipHelp}
        buttonAttrs={{
          buttonText,
          buttonAction: () => buttonAction(form.setFieldValue),
        }}
        blank={blank}
        item={item}
        disabled={disabled}
        fieldRequired={fieldRequired}
        meta={{
          touched: get(form.touched, name),
          error: get(form.errors, name),
        }}
        input={field}
      />
    )}
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
  buttonText: PropTypes.node.isRequired,
  buttonAction: PropTypes.func.isRequired,
  fieldSelector: PropTypes.func,
  disabled: PropTypes.bool,
  fieldRequired: PropTypes.bool,
  tooltipHelp: PropTypes.node,
};

TextButtonField.defaultProps = {
  blank: { label: 'Choose one...', value: '' },
  className: '',
  inputClassName: 'col-md-6',
  disabled: false,
  fieldRequired: false,
  tooltipHelp: null,
  fieldSelector: () => 'text',
  item: {},
};

export default TextButtonField;
