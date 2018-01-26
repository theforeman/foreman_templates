import React from 'react';
import { FieldLevelHelp } from 'patternfly-react';

import TextField from 'foremanReact/components/common/forms/TextField';
import TextButtonField from './TextButtonField';

const SyncSettingField = ({ setting, resetField, disabled }) => {
  // TODO: fails prop type and displays poorly, fix this in core
  const label = (setting) => (
    <div>
      { `${setting.full_name} ` } <FieldLevelHelp content={setting.description}/>
    </div>
  );

  const fieldSelector = (setting) => {
    if (setting.settings_type === 'boolean') {
      return "checkbox";
    }

    if (setting.selection.length !== 0) {
      return "select";
    }

    return "text";
  }

  const handleReset = (setting_name, setting_value) => {
    resetField(setting_name, setting_value)
  }

  return (
      <TextButtonField name={setting.name}
                       label={label(setting)}
                       blank={{}}
                       item={setting}
                       buttonAttrs={ { buttonText: "Use Default",
                                       buttonAction: () => handleReset(setting.name, setting.value) } }
                       fieldSelector={fieldSelector}
                       disabled={disabled}
                       fieldRequired={setting.required}
                       validate={setting.validate}
                       >{setting.value}</TextButtonField>
  )
};

export default SyncSettingField;
