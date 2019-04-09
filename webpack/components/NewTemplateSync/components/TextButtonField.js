import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormControl, InputGroup, Button, Checkbox } from 'patternfly-react';

import CommonForm from 'foremanReact/components/common/forms/CommonForm';

const RenderField = ({
  input,
  label,
  className,
  inputClassName,
  fieldRequired,
  disabled,
  blank,
  item,
  fieldSelector,
  tooltipHelp,
  meta: { error, touched },
  buttonAttrs: { buttonText, buttonAction },
}) => (
  <CommonForm
    label={label}
    className={className}
    inputClassName={inputClassName}
    required={fieldRequired}
    error={error}
    touched={touched}
    tooltipHelp={tooltipHelp}
  >
    <InputGroup>
      <FieldType
        item={item}
        fieldSelector={fieldSelector}
        input={input}
        disabled={disabled}
        blank={blank}
      />
      <InputGroup.Button className="left-padded">
        <Button onClick={buttonAction} disabled={disabled}>
          {buttonText}
        </Button>
      </InputGroup.Button>
    </InputGroup>
  </CommonForm>
);

RenderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  fieldRequired: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  blank: PropTypes.object,
  item: PropTypes.object.isRequired,
  fieldSelector: PropTypes.func,
  tooltipHelp: PropTypes.node,
  meta: PropTypes.object,
  buttonAttrs: PropTypes.object,
};

RenderField.defaultProps = {
  className: '',
  inputClassName: 'col-md-4',
  fieldRequired: false,
  blank: {},
  fieldSelector: null,
  tooltipHelp: null,
  meta: {},
  buttonAttrs: {},
};

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

const InputField = ({ input, disabled }) => (
  <FormControl {...input} type="text" disabled={disabled} />
);

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

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

const CheckboxField = ({ input, item, disabled }) => (
  <Checkbox {...input} disabled={disabled} />
);

const BlankOption = ({ blank }) => {
  if (Object.keys(blank).length === 0) {
    return null;
  }
  return (
    <option key={blank.value} value={blank.value}>
      {blank.label}
    </option>
  );
};

BlankOption.propTypes = {
  blank: PropTypes.object.isRequired,
};

CheckboxField.propTypes = {
  input: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

SelectField.propTypes = {
  input: PropTypes.object.isRequired,
  blank: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

TextButtonField.propTypes = {
  item: PropTypes.object.isRequired,
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
  fieldSelector: PropTypes.func.isRequired,
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
};

export default TextButtonField;
