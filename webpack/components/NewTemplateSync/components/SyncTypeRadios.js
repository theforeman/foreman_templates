import React from 'react';

import { Radio } from 'patternfly-react';
import PropTypes from 'prop-types';

import CommonForm from 'foremanReact/components/common/forms/CommonForm';

const SyncTypeRadios = ({
  controlLabel,
  radios,
  name,
  className = '',
  inputClassName = 'col-md-6',
  disabled = false,
}) => (
  <CommonForm
    label={controlLabel}
    className={className}
    inputClassName={inputClassName}
  >
    {radios.map((item, index) => (
      <Radio
        key={index}
        inline
        title={item.label}
        checked={item.checked}
        disabled={disabled}
        value={item.value}
        onChange={item.onChange}
      >
        {item.label}
      </Radio>
    ))}
  </CommonForm>
);

SyncTypeRadios.propTypes = {
  controlLabel: PropTypes.string.isRequired,
  radios: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
};

SyncTypeRadios.defaultProps = {
  className: undefined,
  inputClassName: undefined,
};

export default SyncTypeRadios;
