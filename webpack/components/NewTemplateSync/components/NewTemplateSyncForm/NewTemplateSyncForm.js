import React from 'react';
import { change } from 'redux-form';

import Form from 'foremanReact/components/common/forms/Form';
import RadioButtonGroup from 'foremanReact/components/common/forms/RadioButtonGroup';
import TextField from 'foremanReact/components/common/forms/TextField';

import SyncSettingsFields from '../SyncSettingFields';
import Title from '../../../layout/Title';

import { formName } from './NewTemplateSyncFormConstants';

const submit = (formValues, dispatch, props) => {
  const { submitForm, syncType, importUrl, exportUrl, history } = props;
  const url = syncType === 'import' ? importUrl : exportUrl;
  const postValues = Object.keys(formValues).reduce((memo, key) => {
    if (key !== 'syncType') {
      memo[key] = formValues[key];
    }
    return memo;
  }, {});
  return submitForm({ url, values: postValues, message: `Templates were ${syncType}ed.`, item: 'TemplateSync' }).then(
    (args) => {
      history.replace({ pathname: '/template_syncs/result' })
    }
  )
}

const redirectToResult = (history) => () => history.push({ pathname: '/template_syncs/result' })

const radioButtons = (syncType) => (
  [
    { label: 'Import', checked: ("import" === syncType), value: "import" },
    { label: 'Export', checked: ("export" === syncType), value: "export" }
  ]
);

const TemplateSyncForm = ({
  submitting,
  error,
  handleSubmit,
  importSettings,
  exportSettings,
  syncType,
  dispatch,
  history,
  validationData,
  valid
}) => {

  const resetToDefault = ((dispatch, change, formName) => (fieldName, value) => {
    dispatch(change(formName, fieldName, value));
  })(dispatch, change, formName);

  return (
      <Form onSubmit={handleSubmit(submit)} disabled={submitting || !valid} submitting={submitting} error={error} onCancel={redirectToResult(history)}>
        <RadioButtonGroup name="syncType" controlLabel="Action type" radios={radioButtons(syncType)} disabled={submitting}></RadioButtonGroup>
        <SyncSettingsFields importSettings={importSettings}
                            exportSettings={exportSettings}
                            syncType={syncType}
                            resetField={resetToDefault}
                            disabled={submitting}
                            validationData={validationData}>
        </SyncSettingsFields>
      </Form>
  );
}

export default TemplateSyncForm;
