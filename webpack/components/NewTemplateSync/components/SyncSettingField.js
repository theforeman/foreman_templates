import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { RedoIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  TextInput,
  Checkbox,
  Button,
  Tooltip,
  Grid,
  GridItem,
  FormSelectOption,
  FormSelect,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Icon,
} from '@patternfly/react-core';
import { validateRepository } from './NewTemplateSyncForm/NewTemplateSyncFormHelpers';

const SyncSettingField = ({
  setting,
  handleChange,
  index,
  resetValue,
  setValidated,
  validated,
  apiResponse,
  isTemplatesLoading,
}) => {
  useEffect(() => {
    if (setting.name === 'repo')
      setValidated(
        validateRepository(setting.value, apiResponse.validationData.repo)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localHandler = (_event, value) => {
    handleChange(index, value);
    if (setting.name === 'repo') {
      setValidated(validateRepository(value, apiResponse.validationData.repo));
    }
  };

  const props = {
    isDisabled: isTemplatesLoading,
    isRequired: [
      'template_sync_repo',
      'template_sync_http_proxy_policy',
    ].includes(setting.id),
    id: setting.fullName,
    key: `input-${setting.fullName}`,
    name: setting.name,
    value: setting.value,
    onChange: localHandler,
    validated: setting.name === 'repo' ? validated : '',
  };

  const inputField = () => {
    if (setting.settingsType === 'boolean') {
      return (
        <Checkbox
          label={__(setting.description)}
          ouiaId={setting.id}
          {...props}
          isChecked={setting.value}
        />
      );
    } else if (setting.selection.length !== 0) {
      return (
        <FormSelect ouiaId={setting.id} {...props} className="without_select2">
          {setting.selection.map((option, optionIndex) => (
            <FormSelectOption
              key={optionIndex}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      );
    }
    return (
      <>
        <TextInput ouiaId={setting.id} {...props} />
        {setting.name === 'repo' && validated === 'error' && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem
                icon={
                  <Icon>
                    <ExclamationCircleIcon />
                  </Icon>
                }
                variant={validated}
              >
                {__(
                  'Invalid repo format, must start with one of: http://, https://, git://, ssh://, git+ssh://, ssh+git://, /'
                )}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </>
    );
  };

  return (
    <Grid>
      <GridItem span={8}>{inputField()}</GridItem>
      <GridItem span={2}>
        <Tooltip
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: __(setting.description),
              }}
            />
          }
        >
          <Button
            ouiaId={`reset-${setting.name}`}
            onClick={() => localHandler(index, resetValue)}
            variant="control"
            icon={<RedoIcon />}
          />
        </Tooltip>
      </GridItem>
    </Grid>
  );
};

SyncSettingField.propTypes = {
  setting: PropTypes.object.isRequired,
  resetValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  handleChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  setValidated: PropTypes.func.isRequired,
  validated: PropTypes.string.isRequired,
  apiResponse: PropTypes.object.isRequired,
  isTemplatesLoading: PropTypes.bool.isRequired,
};

export default SyncSettingField;
