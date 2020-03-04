import React from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';

import Form from 'foremanReact/components/common/forms/Form';

import SyncSettingsFields from '../SyncSettingFields';
import SyncTypeRadios from '../SyncTypeRadios';
import { NEW_TEMPLATE_SYNC_FORM_NAME } from './NewTemplateSyncFormConstants';

const addTaxParams = key => (params, currentTax) => {
  if (currentTax.id) {
    params[key] = [currentTax.id];
  }
  return params;
};

const addOrgParams = addTaxParams('organization_ids');
const addLocParams = addTaxParams('location_ids');

const submit = syncType => (formValues, dispatch, props) => {
  const {
    submitForm,
    importUrl,
    exportUrl,
    history,
    currentFields,
    currentLocation,
    currentOrganization,
  } = props;
  const url = syncType === 'import' ? importUrl : exportUrl;
  const currentFieldNames = Object.keys(currentFields);
  const postValues = Object.keys(formValues).reduce((memo, key) => {
    if (currentFieldNames.includes(key)) {
      memo[key] = formValues[key];
    }
    return memo;
  }, {});

  return submitForm({
    url,
    values: addOrgParams(
      addLocParams(postValues, currentLocation),
      currentOrganization
    ),
    message: `Templates were ${syncType}ed.`,
    item: 'TemplateSync',
  }).then(args => {
    history.replace({ pathname: '/template_syncs/result' });
  });
};

const redirectToResult = history => () =>
  history.push({ pathname: '/template_syncs/result' });

class NewTemplateSyncForm extends React.Component {
  allowedSyncType = (userPermissions, radioAttrs) =>
    this.props.userPermissions[radioAttrs.permission];

  constructor(props) {
    super(props);

    this.radioButtons = [
      { label: 'Import', value: 'import', permission: 'import' },
      { label: 'Export', value: 'export', permission: 'export' },
    ];

    this.state = {
      syncType: this.radioButtons.find(radioAttrs =>
        this.allowedSyncType(props.userPermissions, radioAttrs)
      ).value,
    };
  }

  updateSyncType = event => {
    this.setState({ syncType: event.target.value });
  };

  permitRadioButtons = buttons =>
    buttons.filter(buttonAttrs =>
      this.allowedSyncType(this.props.userPermissions, buttonAttrs)
    );

  initRadioButtons = syncType =>
    this.permitRadioButtons(this.radioButtons).map(buttonAttrs => ({
      get checked() {
        return this.value === syncType;
      },
      onChange: this.updateSyncType,
      ...buttonAttrs,
    }));

  render() {
    const {
      submitting,
      error,
      handleSubmit,
      importSettings,
      exportSettings,
      dispatch,
      history,
      validationData,
      valid,
    } = this.props;

    const resetToDefault = ((dispatchFn, changeFn, nameOfForm) => (
      fieldName,
      value
    ) => {
      dispatchFn(changeFn(nameOfForm, fieldName, value));
    })(dispatch, change, NEW_TEMPLATE_SYNC_FORM_NAME);

    return (
      <Form
        onSubmit={handleSubmit(submit(this.state.syncType))}
        disabled={submitting || (!valid && !error)}
        submitting={submitting}
        error={error}
        onCancel={redirectToResult(history)}
        errorTitle={
          error && error.severity === 'danger' ? __('Error! ') : __('Warning! ')
        }
      >
        <SyncTypeRadios
          name="syncType"
          controlLabel="Action type"
          radios={this.initRadioButtons(this.state.syncType)}
          disabled={submitting}
        />
        <SyncSettingsFields
          importSettings={importSettings}
          exportSettings={exportSettings}
          syncType={this.state.syncType}
          resetField={resetToDefault}
          disabled={submitting}
          validationData={validationData}
        />
      </Form>
    );
  }
}

NewTemplateSyncForm.propTypes = {
  importSettings: PropTypes.array,
  exportSettings: PropTypes.array,
  userPermissions: PropTypes.object.isRequired,
  submitting: PropTypes.bool,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  history: PropTypes.object,
  validationData: PropTypes.object,
  valid: PropTypes.bool.isRequired,
};

NewTemplateSyncForm.defaultProps = {
  importSettings: [],
  exportSettings: [],
  validationData: {},
  error: undefined,
  dispatch: () => {},
  submitting: false,
  history: {},
};

export default NewTemplateSyncForm;
