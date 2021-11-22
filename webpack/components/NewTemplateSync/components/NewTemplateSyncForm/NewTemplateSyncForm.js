import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import ForemanForm from 'foremanReact/components/common/forms/ForemanForm';
import * as Yup from 'yup';
import SyncSettingsFields from '../SyncSettingFields';
import SyncTypeRadios from '../SyncTypeRadios';

const redirectToResult = history => () =>
  history.push({ pathname: '/template_syncs/result' });

const repoFormat = formatAry => value => {
  if (value === undefined) {
    return true;
  }

  const valid = formatAry
    .map(item => value.startsWith(item))
    .reduce((memo, item) => item || memo, false);

  return value && valid;
};

const syncFormSchema = (syncType, settingsObj, validationData) => {
  const schema = (settingsObj[syncType].asMutable() || []).reduce(
    (memo, setting) => {
      if (setting.name === 'repo') {
        return {
          ...memo,
          repo: Yup.string()
            .test(
              'repo-format',
              `Invalid repo format, must start with one of: ${validationData.repo.join(
                ', '
              )}`,
              repoFormat(validationData.repo)
            )
            .required("can't be blank"),
        };
      }
      return memo;
    },
    {}
  );

  return Yup.object().shape({
    [syncType]: Yup.object().shape(schema),
  });
};

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
  currentLocation,
  currentOrganization,
  userPermissions,
}) => {
  const isSyncTypeAllowed = (radioAttrs) => userPermissions[radioAttrs.permission];

  const radioButtons = [
    { label: 'Import', value: 'import', permission: 'import' },
    { label: 'Export', value: 'export', permission: 'export' },
  ];

  const [syncType, setSyncType] = useState(
    radioButtons.find(radioAttrs => isSyncTypeAllowed(radioAttrs))?.value
  )

  const permitedRadioButtons =
    radioButtons.filter(buttonAttrs => isSyncTypeAllowed(buttonAttrs));

  const formRadioButtons =
    permitedRadioButtons.map(buttonAttrs => ({
      get checked() {
        return this.value === syncType;
      },
      onChange: event => { setSyncType(event.target.value) },
      ...buttonAttrs,
    }));


  const addTaxParams = (key, currentTax) => params => {
    if (currentTax.id) {
      params[key] = [currentTax.id];
    }
    return params;
  };

  const addOrgParams = addTaxParams('organization_ids', currentOrganization);
  const addLocParams = addTaxParams('location_ids', currentLocation);

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
          successCallback: () => { history.replace({ pathname: '/template_syncs/result' }) }
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
        radios={formRadioButtons}
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
  currentLocation: PropTypes.object.isRequired,
  currentOrganization: PropTypes.object.isRequired,
};

NewTemplateSyncForm.defaultProps = {
  importSettings: [],
  exportSettings: [],
  validationData: {},
  error: undefined,
  history: {},
};

export default NewTemplateSyncForm;
