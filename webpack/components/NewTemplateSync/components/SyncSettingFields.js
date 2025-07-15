import React from 'react';
import { FormGroup, Popover, Button } from '@patternfly/react-core';
import { upperFirst } from 'lodash';
import PropTypes from 'prop-types';
import { HelpIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

import SyncSettingField from './SyncSettingField';

const SyncSettingsFields = ({
  syncType,
  handleChange,
  values,
  original,
  setValidated,
  validated,
  apiResponse,
  isTemplatesLoading,
}) => {
  const modifyDescription = (setting, type) => {
    if (setting.description) {
      let split = setting.description.split('. ');
      if (setting.name === 'repo' && type !== 'export') {
        split = split.slice(0, split.length - 1);
      }

      split = split.join('.<br>');
      return { ...setting, description: split };
    }
    return setting;
  };

  const specializeDescription = (setting, type) => ({
    ...setting,
    description: setting.description
      ? upperFirst(setting.description.replace(/import\/export/i, type))
      : '',
  });

  const proxyPolicySelected =
    values.find(s => s.id === 'template_sync_http_proxy_policy')?.value ===
    'selected';

  const isHttpUrl = value => value && /^(https?:\/\/)/.test(value);
  const proxyPolicyEnabled = isHttpUrl(
    values.find(s => s.id === 'template_sync_repo')?.value
  );

  return (
    <React.Fragment>
      {values
        .filter(
          setting =>
            setting.id !== 'template_sync_http_proxy_policy' ||
            proxyPolicyEnabled
        )
        .filter(
          setting =>
            setting.id !== 'template_sync_http_proxy_id' || proxyPolicySelected
        )
        .map(setting => modifyDescription(setting, syncType))
        .map(setting => specializeDescription(setting, syncType))
        .map((setting, i) => (
          <FormGroup
            fieldId={setting.fullName}
            isRequired={[
              'template_sync_repo',
              'template_sync_http_proxy_policy',
            ].includes(setting.id)}
            label={__(setting.fullName)}
            key={i}
            labelIcon={
              <Popover
                bodyContent={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: __(setting.description),
                    }}
                  />
                }
              >
                <Button
                  variant="plain"
                  ouiaId={`reset-${setting.fullName}`}
                  icon={<HelpIcon />}
                />
              </Popover>
            }
          >
            <SyncSettingField
              setValidated={setValidated}
              validated={validated}
              setting={setting}
              resetValue={original[i]?.value || ''}
              handleChange={handleChange}
              index={i}
              apiResponse={apiResponse}
              isTemplatesLoading={isTemplatesLoading}
            />
          </FormGroup>
        ))}
    </React.Fragment>
  );
};

SyncSettingsFields.propTypes = {
  handleChange: PropTypes.func.isRequired,
  original: PropTypes.array.isRequired,
  syncType: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  setValidated: PropTypes.func.isRequired,
  validated: PropTypes.string.isRequired,
  apiResponse: PropTypes.object.isRequired,
  isTemplatesLoading: PropTypes.bool.isRequired,
};

export default SyncSettingsFields;
