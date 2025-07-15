import React, { useState } from 'react';
import { compose } from 'redux';
import { useDispatch } from 'react-redux';
import {
  useForemanLocation,
  useForemanOrganization,
} from 'foremanReact/Root/Context/ForemanContext';
import { translate as __ } from 'foremanReact/common/I18n';
import { APIActions } from 'foremanReact/redux/API';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';
import PropTypes from 'prop-types';

import {
  Form,
  FormGroup,
  ActionGroup,
  Button,
  Radio,
} from '@patternfly/react-core';
import SyncSettingsFields from '../SyncSettingFields';
import { SYNC_RESULT_URL, SYNC_SETTINGS_FORM_SUBMIT } from '../../../../consts';

import './NewTemplateSyncForm.scss';

const NewTemplateSyncForm = ({
  apiResponse,
  setReceivedTemplates,
  setIsTemplatesLoading,
  isTemplatesLoading,
  setView,
}) => {
  const { apiUrls, settings, userPermissions } = apiResponse;
  const dispatch = useDispatch();

  const allowedSyncType = (currentUserPermissions, radioAttrs) =>
    currentUserPermissions[radioAttrs.permission];

  const radioButtons = [
    { label: __('Import'), value: 'import', permission: 'import' },
    { label: __('Export'), value: 'export', permission: 'export' },
  ];

  const [syncType, setSyncType] = useState(
    radioButtons.find(radioAttrs =>
      allowedSyncType(userPermissions, radioAttrs)
    ).value
  );

  const updateSyncType = event => {
    setSyncType(event.target.value);
  };

  const permitRadioButtons = buttons =>
    buttons.filter(buttonAttrs =>
      allowedSyncType(userPermissions, buttonAttrs)
    );

  const initRadioButtons = templateSyncType =>
    permitRadioButtons(radioButtons).map(buttonAttrs => ({
      get checked() {
        return buttonAttrs.value === templateSyncType;
      },
      onChange: updateSyncType,
      ...buttonAttrs,
    }));

  const addTaxParams = (key, currentTax) => params => {
    if (currentTax && currentTax.id) {
      return { ...params, [key]: [currentTax.id] };
    }
    return params;
  };

  const addOrgParams = addTaxParams(
    'organization_ids',
    useForemanOrganization()
  );
  const addLocParams = addTaxParams('location_ids', useForemanLocation());

  const settingsAry = syncType === 'import' ? settings.import : settings.export;

  // Check if user has proxies, if not, delete option from selection
  const hasProxies =
    settingsAry.find(s => s.id === 'template_sync_http_proxy_id')?.selection
      .length !== 0;
  if (!hasProxies) {
    const proxyPolicy = settingsAry.find(
      s => s.id === 'template_sync_http_proxy_policy'
    );

    proxyPolicy.selection = proxyPolicy.selection.filter(
      item => item.value !== 'selected'
    );
  }

  const [importValues, setImportValues] = useState(settings.import);
  const [exportValues, setExportValues] = useState(settings.export);

  const transformValues = values =>
    values.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

  const handleSubmit = () => {
    const url = syncType === 'import' ? apiUrls.importUrl : apiUrls.exportUrl;
    const data = syncType === 'import' ? importValues : exportValues;
    setIsTemplatesLoading(true);
    return dispatch(
      APIActions.post({
        key: SYNC_SETTINGS_FORM_SUBMIT,
        url,
        params: {
          ...compose(addLocParams, addOrgParams)(transformValues(data)),
        },
        handleSuccess: response => {
          setReceivedTemplates(deepPropsToCamelCase(response.data));
          setView(SYNC_RESULT_URL);
        },
        handleError: () => setIsTemplatesLoading(false),
        successToast: () => __('Data was successfully imported.'),
        errorToast: response =>
          response?.response?.data?.error ||
          // eslint-disable-next-line camelcase
          response?.response?.data?.error?.full_messages?.[0] ||
          response,
      })
    );
  };

  const stateSetter = (valueSetter, index, value, oldValues) => {
    const newValue = {
      ...oldValues[index],
      value,
    };
    valueSetter(items =>
      items.map((item, i) => (i === index ? newValue : item))
    );
  };

  const handleChange = (index, value) => {
    if (syncType === 'import')
      stateSetter(setImportValues, index, value, importValues);
    else stateSetter(setExportValues, index, value, exportValues);
  };

  const [validated, setValidated] = useState('');

  return (
    <Form id="sync-form" isWidthLimited>
      <FormGroup isInline id="sync-type_formGroup">
        {initRadioButtons(syncType).map(radio => (
          <Radio
            ouiaId={radio.value}
            id={radio.value}
            key={radio.value}
            label={radio.label}
            isChecked={radio.value === syncType}
            onChange={() => setSyncType(radio.value)}
          />
        ))}
      </FormGroup>
      {settings.import.length > 0 && settings.export.length > 0 && (
        <SyncSettingsFields
          handleChange={handleChange}
          values={syncType === 'import' ? importValues : exportValues}
          syncType={syncType}
          original={settingsAry}
          validated={validated}
          setValidated={setValidated}
          apiResponse={apiResponse}
          isTemplatesLoading={isTemplatesLoading}
        />
      )}
      <ActionGroup>
        <Button
          ouiaId="submit"
          variant="primary"
          onClick={handleSubmit}
          isLoading={isTemplatesLoading}
          isDisabled={isTemplatesLoading || validated === 'error'}
        >
          {__('Submit')}
        </Button>
        <Button
          ouiaId="cancel"
          variant="link"
          onClick={() => setView(SYNC_RESULT_URL)}
        >
          {__('Cancel')}
        </Button>
      </ActionGroup>
    </Form>
  );
};

export default NewTemplateSyncForm;

NewTemplateSyncForm.propTypes = {
  apiResponse: PropTypes.object.isRequired,
  setReceivedTemplates: PropTypes.func.isRequired,
  setIsTemplatesLoading: PropTypes.func.isRequired,
  isTemplatesLoading: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired,
};
