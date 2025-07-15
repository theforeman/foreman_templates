import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { translate as __ } from 'foremanReact/common/I18n';
import NewTemplateSyncForm from './components/NewTemplateSyncForm/NewTemplateSyncForm';
import TemplateSyncResult from '../TemplateSyncResult/TemplateSyncResult';
import { SYNC_BASE_URL, SYNC_RESULT_URL } from '../../consts';

export const NewTemplateSync = ({ apiResponse }) => {
  const [view, setView] = useState(SYNC_BASE_URL);
  const [receivedTemplates, setReceivedTemplates] = useState(null);
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);

  useEffect(() => {
    if (receivedTemplates !== null) {
      setIsTemplatesLoading(false);
    }
  }, [receivedTemplates]);

  return (
    <PageLayout header={__('Import or Export Templates')} searchable={false}>
      {view === SYNC_BASE_URL && (
        <NewTemplateSyncForm
          apiResponse={apiResponse}
          isTemplatesLoading={isTemplatesLoading}
          setReceivedTemplates={setReceivedTemplates}
          setIsTemplatesLoading={setIsTemplatesLoading}
          setView={setView}
        />
      )}
      {view === SYNC_RESULT_URL && (
        <TemplateSyncResult
          apiResponse={apiResponse}
          isTemplatesLoading={isTemplatesLoading}
          receivedTemplates={receivedTemplates}
          setView={setView}
        />
      )}
    </PageLayout>
  );
};

export default NewTemplateSync;

NewTemplateSync.propTypes = {
  apiResponse: PropTypes.object.isRequired,
};
