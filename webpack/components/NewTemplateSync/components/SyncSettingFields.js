import React from 'react';
import { required } from 'redux-form-validators';
import { memoize } from 'lodash';
import PropTypes from 'prop-types';

import SyncSettingField from './SyncSettingField';

const repoFormat = memoize(formatAry => value => {
  const valid = formatAry.map((item) => value.startsWith(item))
                         .reduce((memo, item) => (item || memo), false)

  if (value && valid) {
    return undefined;
  } else {
    return `Invalid repo format, must start with one of: ${formatAry.join(', ')}`;
  }
});

const SyncSettingsFields = ({
  importSettings,
  exportSettings,
  syncType,
  resetField,
  disabled,
  validationData
}) => {
  const mapSettings = (settingsAry) =>
    (
      <React.Fragment>
        { addValidations(settingsAry).map((setting, index) =>
          (<SyncSettingField setting={setting}
                             key={setting.name}
                             disabled={disabled}
                             resetField={resetField}>
          </SyncSettingField>))
        }
      </React.Fragment>
    )

  const addValidations = (validationData => settingsAry => {
    return settingsAry.map((setting) => {
      switch(setting.name) {
        case 'repo':
          return setting.merge({ 'required': true, 'validate': [repoFormat(validationData['repo'])] })
        default:
          return setting;
      }
    })
  })(validationData);

  return (syncType === "import" ? mapSettings(importSettings) : mapSettings(exportSettings));
}

SyncSettingsFields.propTypes = {
  importSettings: PropTypes.array.isRequired,
  exportSettings: PropTypes.array.isRequired,
  syncType: PropTypes.string.isRequired,
  resetField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  validationData: PropTypes.object,
};

export default SyncSettingsFields;
