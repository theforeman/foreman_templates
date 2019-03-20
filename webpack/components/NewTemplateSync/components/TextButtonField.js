import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormControl, InputGroup, Button, Checkbox } from 'patternfly-react';

import TextField from 'foremanReact/components/common/forms/TextField';
import CommonForm from 'foremanReact/components/common/forms/CommonForm';

const renderField = ({
  input,
  label,
  className,
  inputClassName,
  fieldRequired,
  disabled,
  blank,
  item,
  fieldSelector,
  tooltipHelp = null,
  meta: { error, touched },
  buttonAttrs: { buttonText = "Action", buttonAction },
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
      <FieldType item={item} fieldSelector={fieldSelector} input={input} disabled={disabled} blank={blank} />
      <InputGroup.Button className="left-padded">
        <Button onClick={buttonAction} disabled={disabled}>{ buttonText }</Button>
      </InputGroup.Button>
    </InputGroup>
  </CommonForm>
)

const TextButtonField = ({
  item,
  label,
  name,
  className = '',
  inputClassName = 'col-md-6',
  blank = { label: "Choose one...", value: "" },
  buttonAttrs,
  fieldSelector,
  validate,
  disabled = false,
  fieldRequired = false,
  tooltipHelp = null,
}) => (
  <Field name={name}
         label={label}
         type={fieldSelector(item)}
         fieldSelector={fieldSelector}
         tooltipHelp={tooltipHelp}
         component={renderField}
         buttonAttrs={buttonAttrs}
         blank={blank}
         item={item}
         disabled={disabled}
         validate={item.validate}
         fieldRequired={fieldRequired}>
  </Field>
);

const FieldType = ({ item, fieldSelector, input, disabled, blank }) => {
  if (!fieldSelector) {
    return (<InputField input={input} disabled={disabled} />);
  }

  switch (fieldSelector(item)) {
    case "text":
      return <InputField input={input} disabled={disabled} />;
    case "select":
      return <SelectField input={input} blank={blank} item={item} disabled={disabled} />;
    case "checkbox":
      return <CheckboxField input={input} item={item} disabled={disabled} />;
    default:
      throw new Error(`Unknown field type ${fieldSelector(item)} for ${item}`);
  }
}

const InputField = ({ input, disabled }) =>
  <FormControl { ...input } type="text" disabled={disabled}></FormControl>

const SelectField = ({ input, blank, item, disabled }) =>
  <FormControl { ...input } componentClass="select" disabled={disabled}>
    <BlankOption blank={blank} />
    { item.selection.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>) }
  </FormControl>

const CheckboxField = ({ input, item, disabled }) => {
  return <Checkbox { ...input } disabled={disabled}></Checkbox>
}

const BlankOption = ({ blank }) => {
  if (Object.keys(blank).length === 0) {
    return null;
  } else {
    return <option key={blank.value} value={blank.value}>{blank.label}</option>;
  }
}

export default TextButtonField;
