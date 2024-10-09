import React from 'react';
import { upperFirst } from 'lodash';
import PropTypes from 'prop-types';

import SyncSettingField from './SyncSettingField';
import ProxySettingsFields from './ProxySettingFields';

const SyncSettingsFields = ({
  importSettings,
  exportSettings,
  syncType,
  resetField,
  formProps: { isSubmitting },
}) => {
  const addRequiredToSetting = setting =>
    setting.name === 'repo'
      ? setting.merge({
          required: true,
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
  const proxyPolicySetting = settingsAry.find(
    setting => setting.id === 'template_sync_http_proxy_policy'
  );
  const proxyIdSetting = settingsAry.find(
    setting => setting.id === 'template_sync_http_proxy_id'
  );

  return (
    <React.Fragment>
      {settingsAry
        .filter(
          setting =>
            setting.id !== 'template_sync_http_proxy_policy' &&
            setting.id !== 'template_sync_http_proxy_id'
        )
        .map(addRequiredToSetting)
        .map(setting => modifyDescription(setting, syncType))
        .map(setting => specializeDescription(setting, syncType))
        .map(setting => (
          <SyncSettingField
            setting={setting}
            syncType={syncType}
            key={setting.name}
            disabled={isSubmitting}
            resetField={resetField}
          />
        ))}
      <ProxySettingsFields
        proxyPolicySetting={proxyPolicySetting}
        proxyIdSetting={proxyIdSetting}
        syncType={syncType}
        resetField={resetField}
      />
    </React.Fragment>
  );
};

SyncSettingsFields.propTypes = {
  importSettings: PropTypes.array.isRequired,
  exportSettings: PropTypes.array.isRequired,
  syncType: PropTypes.string.isRequired,
  resetField: PropTypes.func.isRequired,
  formProps: PropTypes.object,
};

SyncSettingsFields.defaultProps = {
  formProps: {},
};

export default SyncSettingsFields;
