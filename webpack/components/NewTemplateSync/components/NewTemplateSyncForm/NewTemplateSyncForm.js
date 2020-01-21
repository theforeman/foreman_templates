import React from 'react';
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
    } = this.props;

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
          const url = this.state.syncType === 'import' ? importUrl : exportUrl;
          return submitForm({
            url,
            values: compose(
              addLocParams,
              addOrgParams
            )(values[this.state.syncType]),
            message: `Templates were ${this.state.syncType}ed.`,
            item: 'TemplateSync',
          }).then(args => {
            history.replace({ pathname: '/template_syncs/result' });
          });
        }}
        initialValues={initialValues}
        validationSchema={syncFormSchema(
          this.state.syncType,
          { import: importSettings, export: exportSettings },
          validationData
        )}
        onCancel={redirectToResult(history)}
        error={error}
      >
        <SyncTypeRadios
          name="syncType"
          controlLabel="Action type"
          radios={this.initRadioButtons(this.state.syncType)}
        />
        <SyncSettingsFields
          importSettings={importSettings}
          exportSettings={exportSettings}
          syncType={this.state.syncType}
          resetField={resetToDefault}
        />
      </ForemanForm>
    );
  }
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
