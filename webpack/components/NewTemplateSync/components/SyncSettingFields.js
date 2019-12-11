import React from 'react';
import { memoize, upperFirst } from 'lodash';
import PropTypes from 'prop-types';

import SyncSettingField from './SyncSettingField';

const repoFormat = memoize(formatAry => value => {
  if (value) {
    const valid = formatAry
      .map(item => value.startsWith(item))
      .reduce((memo, item) => item || memo, false);

    if (valid) {
      return undefined;
    }
  }

  return `Invalid repo format, must start with one of: ${formatAry.join(', ')}`;
});

const SyncSettingsFields = ({
  importSettings,
  exportSettings,
  syncType,
  resetField,
  disabled,
  validationData,
}) => {
  const addValidationToSetting = (setting, validations) =>
    setting.name === 'repo'
      ? setting.merge({
          required: true,
          validate: [repoFormat(validations.repo)],
        })
      : setting;

  const modifyDescription = (setting, type) => {
    if (setting.description) {
      let split = setting.description.split('. ');
      if (setting.name === 'repo' && type !== 'export') {
        split = split.slice(0, split.length - 1);
      }

      split = split.join('.<br>');
      return setting.set('description', split);
    }
    return setting;
  };

  const specializeDescription = (setting, type) =>
    setting.set(
      'description',
      upperFirst(setting.description.replace(/import\/export/i, type))
    );

  const settingsAry = syncType === 'import' ? importSettings : exportSettings;

  return (
    <React.Fragment>
      {settingsAry
        .map(setting => addValidationToSetting(setting, validationData))
        .map(setting => modifyDescription(setting, syncType))
        .map(setting => specializeDescription(setting, syncType))
        .map(setting => (
          <SyncSettingField
            setting={setting}
            key={setting.name}
            disabled={disabled}
            resetField={resetField}
          />
        ))}
    </React.Fragment>
  );
};

SyncSettingsFields.propTypes = {
  importSettings: PropTypes.array.isRequired,
  exportSettings: PropTypes.array.isRequired,
  syncType: PropTypes.string.isRequired,
  resetField: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  validationData: PropTypes.object,
};

SyncSettingsFields.defaultProps = {
  disabled: false,
  validationData: {},
};

export default SyncSettingsFields;
