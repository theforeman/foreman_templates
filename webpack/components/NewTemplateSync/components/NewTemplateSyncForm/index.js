import { connect } from 'react-redux';

import * as FormActions from 'foremanReact/redux/actions/common/forms';

import NewTemplateSyncForm from './NewTemplateSyncForm';

import {
  selectImportSettings,
  selectExportSettings,
} from '../../NewTemplateSyncSelectors';

import { selectInitialFormValues } from './NewTemplateSyncFormSelectors';

const mapStateToProps = (state, ownProps) => {
  const importSettings = selectImportSettings(state);

  const exportSettings = selectExportSettings(state);

  const initialFormValues = selectInitialFormValues(state);

  return {
    initialValues: { ...initialFormValues },
    importSettings,
    exportSettings,
  };
};

export default connect(mapStateToProps, FormActions)(NewTemplateSyncForm);
