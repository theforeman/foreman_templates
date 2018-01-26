import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import * as FormActions from 'foremanReact/redux/actions/common/forms';

import { formName } from './NewTemplateSyncFormConstants';
import NewTemplateSyncForm from './NewTemplateSyncForm';

import { selectImportSettings, selectExportSettings } from '../../NewTemplateSyncSelectors';
import { selectInitialFormValues } from './NewTemplateSyncFormSelectors';

const mapStateToProps = (state, ownProps) => {
  const initSyncType = { syncType: "import" };

  const syncType = formValueSelector(formName)(state, 'syncType');

  const importSettings = selectImportSettings(state);

  const exportSettings = selectExportSettings(state);

  const initialFormValues = selectInitialFormValues(state);

  if (syncType) {
    return ({ initialValues: { ...initialFormValues, syncType }, syncType, importSettings, exportSettings });
  } else {
    return ({ initialValues: { ...initialFormValues, ...initSyncType }, ...initSyncType, importSettings, exportSettings });
  }
}

const form = reduxForm({ form: formName })(NewTemplateSyncForm);
export default connect(mapStateToProps, FormActions)(form);
