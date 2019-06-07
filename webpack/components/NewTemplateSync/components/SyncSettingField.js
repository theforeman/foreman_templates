import React from 'react';
import PropTypes from 'prop-types';
import { FieldLevelHelp } from 'patternfly-react';

import TextButtonField from './TextButtonField';
import ButtonTooltip from './ButtonTooltip';

const SyncSettingField = ({ setting, resetField, disabled, syncType }) => {
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

  const tooltipContent = (
    <div
      dangerouslySetInnerHTML={{
        __html: setting.description,
      }}
    />
  );

  return (
    <TextButtonField
      name={`${syncType}.${setting.name}`}
      label={label(setting)}
      blank={{}}
      item={setting}
      buttonText={<ButtonTooltip tooltipId={setting.name} />}
      buttonAction={resetField(`${syncType}.${setting.name}`, setting.value)}
      fieldSelector={fieldSelector}
      disabled={disabled}
      fieldRequired={setting.required}
      tooltipHelp={<FieldLevelHelp content={tooltipContent} />}
    >
      {setting.value}
    </TextButtonField>
  );
};

SyncSettingField.propTypes = {
  setting: PropTypes.object.isRequired,
  resetField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  syncType: PropTypes.string.isRequired,
};

export default SyncSettingField;
