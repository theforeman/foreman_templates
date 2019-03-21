import React from 'react';
import { LoadingState } from 'patternfly-react';
import PageLayout from 'foremanReact/pages/common/PageLayout/PageLayout'

import NewTemplateSyncForm from './components/NewTemplateSyncForm';
import './NewTemplateSync.scss';

class NewTemplateSync extends React.Component {
  componentDidMount() {
    const { apiUrls: { syncSettingsUrl }, getSyncSettings } = this.props;
    getSyncSettings(syncSettingsUrl);
  }

  render() {
    const { apiUrls: { importUrl, exportUrl }, loadingSettings, history, validationData } = this.props;
    return (
      <LoadingState loading={loadingSettings}>
        <PageLayout
          header={__('Import or Export Templates')}
          searchable={false}>

          <NewTemplateSyncForm validationData={validationData}
                               importUrl={importUrl}
                               exportUrl={exportUrl}
                               history={history} />
        </PageLayout>
      </LoadingState>
    );
  }
}

export default NewTemplateSync;
