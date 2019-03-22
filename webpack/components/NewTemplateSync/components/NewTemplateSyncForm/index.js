import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import * as FormActions from 'foremanReact/redux/actions/common/forms';

import { formName } from './NewTemplateSyncFormConstants';
import NewTemplateSyncForm from './NewTemplateSyncForm';

import { selectImportSettings, selectExportSettings } from '../../NewTemplateSyncSelectors';
import { selectInitialFormValues, selectRegisteredFields } from './NewTemplateSyncFormSelectors';

const mapStateToProps = (state, ownProps) => {
  const importSettings = selectImportSettings(state);

  const exportSettings = selectExportSettings(state);

  const initialFormValues = selectInitialFormValues(state);

  const currentFields = selectRegisteredFields(formName, state);

  return ({ initialValues: { ...initialFormValues }, importSettings, exportSettings, currentFields });
}

const form = reduxForm({ form: formName })(NewTemplateSyncForm);
export default connect(mapStateToProps, FormActions)(form);
