import { connect } from 'react-redux';

import * as FormActions from 'foremanReact/redux/actions/common/forms';

import NewTemplateSyncForm from './NewTemplateSyncForm';

import {
  selectImportSettings,
  selectExportSettings,
  selectProxySettings,
} from '../../NewTemplateSyncSelectors';

import { selectInitialFormValues } from './NewTemplateSyncFormSelectors';

const mapStateToProps = (state, ownProps) => {
  const importSettings = selectImportSettings(state);

  const exportSettings = selectExportSettings(state);

  const proxySettings = selectProxySettings(state);

  const initialFormValues = selectInitialFormValues(state);

  return {
    initialValues: { ...initialFormValues },
    importSettings,
    exportSettings,
    proxySettings,
  };
};

export default connect(mapStateToProps, FormActions)(NewTemplateSyncForm);
