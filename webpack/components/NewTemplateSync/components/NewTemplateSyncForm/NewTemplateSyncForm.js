import React from 'react';
import { change } from 'redux-form';

import Form from 'foremanReact/components/common/forms/Form';
import RadioButtonGroup from 'foremanReact/components/common/forms/RadioButtonGroup';
import TextField from 'foremanReact/components/common/forms/TextField';

import SyncSettingsFields from '../SyncSettingFields';
import SyncTypeRadios from './SyncTypeRadios';

import { formName } from './NewTemplateSyncFormConstants';

const submit = (syncType) => (formValues, dispatch, props) => {
  const { submitForm, importUrl, exportUrl, history, currentFields } = props;
  const url = syncType === 'import' ? importUrl : exportUrl;
  const currentFieldNames = Object.keys(currentFields);
  const postValues = Object.keys(formValues).reduce((memo, key) => {
    if (currentFieldNames.includes(key)) {
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

class TemplateSyncForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      syncType: 'import'
    }
  }

  updateSyncType = (event) => {
    this.setState({ syncType: event.target.value });
  }

  radioButtons = (syncType) => (
    [
      { label: 'Import', checked: ("import" === syncType), value: "import", onChange: this.updateSyncType },
      { label: 'Export', checked: ("export" === syncType), value: "export", onChange: this.updateSyncType }
    ]
  );

  render() {
    const {
      submitting,
      error,
      handleSubmit,
      importSettings,
      exportSettings,
      currentFields,
      dispatch,
      history,
      validationData,
      valid
    } = this.props;

    const resetToDefault = ((dispatch, change, formName) => (fieldName, value) => {
      dispatch(change(formName, fieldName, value));
    })(dispatch, change, formName);

    return (
      <Form onSubmit={handleSubmit(submit(this.state.syncType))}
            disabled={submitting || !valid}
            submitting={submitting}
            error={error}
            onCancel={redirectToResult(history)}>
        <SyncTypeRadios name="syncType"
                        controlLabel="Action type"
                        radios={this.radioButtons(this.state.syncType)}
                        disabled={submitting} />
        <SyncSettingsFields importSettings={importSettings}
                            exportSettings={exportSettings}
                            syncType={this.state.syncType}
                            resetField={resetToDefault}
                            disabled={submitting}
                            validationData={validationData} />
      </Form>
    );
  }
}

export default TemplateSyncForm;
