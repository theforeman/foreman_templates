import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import ForemanForm from 'foremanReact/components/common/forms/ForemanForm';
import { useForemanLocation, useForemanOrganization } from 'foremanReact/Root/Context/ForemanContext';

import SyncSettingsFields from '../SyncSettingFields';
import SyncTypeRadios from '../SyncTypeRadios';
import { redirectToResult, repoFormat, syncFormSchema } from './NewTemplateSyncFormHelpers';

const NewTemplateSyncForm = ({
  error,
  submitForm,
  importSettings,
  exportSettings,
  history,
  validationData,
  importUrl,
  exportUrl,
  initialValues,
  userPermissions
}) => {
  const allowedSyncType = (currentUserPermissions, radioAttrs) =>
    currentUserPermissions[radioAttrs.permission];

  const radioButtons = [
    { label: 'Import', value: 'import', permission: 'import' },
    { label: 'Export', value: 'export', permission: 'export' },
  ];

  const [syncType, setSyncType] = useState(radioButtons.find(radioAttrs => allowedSyncType(userPermissions, radioAttrs)).value)

  const updateSyncType = event => {
    setSyncType(event.target.value);
  };

  const permitRadioButtons = buttons =>
    buttons.filter(buttonAttrs =>
      allowedSyncType(userPermissions, buttonAttrs)
    );

  const initRadioButtons = syncType =>
    permitRadioButtons(radioButtons).map(buttonAttrs => ({
      get checked() {
        return buttonAttrs.value === syncType;
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

  const addOrgParams = addTaxParams('organization_ids', useForemanOrganization());
  const addLocParams = addTaxParams('location_ids', useForemanLocation());

  const resetToDefault = (fieldName, fieldValue) => resetFn =>
    resetFn(fieldName, fieldValue);

  return (
    <ForemanForm
      onSubmit={(values, actions) => {
        const url = syncType === 'import' ? importUrl : exportUrl;
        return submitForm({
          url,
          values: compose(
            addLocParams,
            addOrgParams
          )(values[syncType]),
          message: `Templates were ${syncType}ed.`,
          item: 'TemplateSync',
        }).then(args => {
          history.replace({ pathname: '/template_syncs/result' });
        });
      }}
      initialValues={initialValues}
      validationSchema={syncFormSchema(
        syncType,
        { import: importSettings, export: exportSettings },
        validationData
      )}
      onCancel={redirectToResult(history)}
      error={error}
    >
      <SyncTypeRadios
        name="syncType"
        controlLabel="Action type"
        radios={initRadioButtons(syncType)}
      />
      <SyncSettingsFields
        importSettings={importSettings}
        exportSettings={exportSettings}
        syncType={syncType}
        resetField={resetToDefault}
      />
    </ForemanForm>
  );
}

NewTemplateSyncForm.propTypes = {
  importSettings: PropTypes.array,
  exportSettings: PropTypes.array,
  userPermissions: PropTypes.object.isRequired,
  error: PropTypes.object,
  history: PropTypes.object,
  validationData: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  exportUrl: PropTypes.string.isRequired,
  importUrl: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired,
};

NewTemplateSyncForm.defaultProps = {
  importSettings: [],
  exportSettings: [],
  validationData: {},
  error: undefined,
  history: {},
};

export default NewTemplateSyncForm;
