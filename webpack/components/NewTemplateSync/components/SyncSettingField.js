import React from 'react';
import { FieldLevelHelp, OverlayTrigger, Tooltip, Icon } from 'patternfly-react';
import PropTypes from 'prop-types';

import TextField from 'foremanReact/components/common/forms/TextField';
import TextButtonField from './TextButtonField';

const ButtonTooltip = props => {
  const tooltip = (
    <Tooltip id={`${props.tooltipId}-tooltip-id`}>
      <span>
        Use default value from settings
      </span>
    </Tooltip>
  );

  return (
    <OverlayTrigger overlay={tooltip} trigger={['hover', 'focus']}>
        <Icon type="fa" name="refresh" />
    </OverlayTrigger>
  );
}

const SyncSettingField = ({ setting, resetField, disabled }) => {
  const label = (setting) => `${setting.fullName} `;

  const fieldSelector = (setting) => {
    if (setting.settingsType === 'boolean') {
      return "checkbox";
    }

    if (setting.selection.length !== 0) {
      return "select";
    }

    return "text";
  }

  const handleReset = (settingName, settingValue) => {
    resetField(settingName, settingValue)
  }

  return (
      <TextButtonField name={setting.name}
                       label={label(setting)}
                       blank={{}}
                       item={setting}
                       buttonAttrs={ { buttonText: <ButtonTooltip tooltipId={setting.name} />,
                                       buttonAction: () => handleReset(setting.name, setting.value) } }
                       fieldSelector={fieldSelector}
                       disabled={disabled}
                       fieldRequired={setting.required}
                       validate={setting.validate}
                       tooltipHelp={<FieldLevelHelp content={setting.description}/>}
                       >{setting.value}</TextButtonField>
  )
};

SyncSettingField.propTypes = {
  setting: PropTypes.object.isRequired,
  resetField: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SyncSettingField;
