import React from 'react';
import PropTypes from 'prop-types';
import { FieldLevelHelp } from 'patternfly-react';

import TextButtonField from './TextButtonField';
import ButtonTooltip from './ButtonTooltip';

const SyncSettingField = ({ setting, resetField, disabled }) => {
  const label = settingObj => `${settingObj.fullName} `;

  const fieldSelector = settingObj => {
    if (settingObj.settingsType === 'boolean') {
      return 'checkbox';
    }

    if (settingObj.selection.length !== 0) {
      return 'select';
    }

    return 'text';
  };

  const handleReset = (settingName, settingValue) => {
    resetField(settingName, settingValue);
  };

  return (
    <TextButtonField
      name={setting.name}
      label={label(setting)}
      blank={{}}
      item={setting}
      buttonAttrs={{
        buttonText: <ButtonTooltip tooltipId={setting.name} />,
        buttonAction: () => handleReset(setting.name, setting.value),
      }}
      fieldSelector={fieldSelector}
      disabled={disabled}
      fieldRequired={setting.required}
      validate={setting.validate}
      tooltipHelp={<FieldLevelHelp content={setting.description} />}
    >
      {setting.value}
    </TextButtonField>
  );
};

SyncSettingField.propTypes = {
  setting: PropTypes.object.isRequired,
  resetField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default SyncSettingField;
