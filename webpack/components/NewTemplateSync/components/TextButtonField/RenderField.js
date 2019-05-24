import React from 'react';
import CommonForm from 'foremanReact/components/common/forms/CommonForm';
import { InputGroup, Button } from 'patternfly-react';
import PropTypes from 'prop-types';

import FieldType from './FieldType';

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

export default RenderField;
