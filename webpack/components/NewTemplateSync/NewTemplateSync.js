import React from 'react';
import { LoadingState } from 'patternfly-react';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import PropTypes from 'prop-types';

import NewTemplateSyncForm from './components/NewTemplateSyncForm';
import './NewTemplateSync.scss';

class NewTemplateSync extends React.Component {
  componentDidMount() {
    const {
      apiUrls: { syncSettingsUrl },
      getSyncSettings,
    } = this.props;
    getSyncSettings(syncSettingsUrl);
  }

  render() {
    const {
      apiUrls: { importUrl, exportUrl },
      loadingSettings,
      history,
      validationData,
      userPermissions,
    } = this.props;

    return (
      <LoadingState loading={loadingSettings}>
        <PageLayout
          header={__('Import or Export Templates')}
          searchable={false}
        >
          <NewTemplateSyncForm
            validationData={validationData}
            importUrl={importUrl}
            exportUrl={exportUrl}
            history={history}
            userPermissions={userPermissions}
          />
        </PageLayout>
      </LoadingState>
    );
  }
}

NewTemplateSync.propTypes = {
  getSyncSettings: PropTypes.func.isRequired,
  apiUrls: PropTypes.object.isRequired,
  userPermissions: PropTypes.object.isRequired,
  history: PropTypes.object,
  validationData: PropTypes.object,
  loadingSettings: PropTypes.bool.isRequired,
};

NewTemplateSync.defaultProps = {
  validationData: {},
  history: {},
};

export default NewTemplateSync;
