import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import * as FormActions from 'foremanReact/redux/actions/common/forms';

import { selectLayout } from 'foremanReact/components/Layout/LayoutSelectors';

import { NEW_TEMPLATE_SYNC_FORM_NAME } from './NewTemplateSyncFormConstants';
import NewTemplateSyncForm from './NewTemplateSyncForm';

import {
  selectImportSettings,
  selectExportSettings,
} from '../../NewTemplateSyncSelectors';
import {
  selectInitialFormValues,
  selectRegisteredFields,
} from './NewTemplateSyncFormSelectors';

const mapStateToProps = (state, ownProps) => {
  const importSettings = selectImportSettings(state);

  const exportSettings = selectExportSettings(state);

  const initialFormValues = selectInitialFormValues(state);

  const currentFields = selectRegisteredFields(
    NEW_TEMPLATE_SYNC_FORM_NAME,
    state
  );

  return {
    initialValues: { ...initialFormValues },
    importSettings,
    exportSettings,
    currentFields,
    currentOrganization: selectLayout(state).currentOrganization,
    currentLocation: selectLayout(state).currentLocation,
  };
};

const form = reduxForm({ form: NEW_TEMPLATE_SYNC_FORM_NAME })(
  NewTemplateSyncForm
);
export default connect(mapStateToProps, FormActions)(form);
