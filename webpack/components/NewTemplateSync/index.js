import React, { useContext } from 'react';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { translate as __ } from 'foremanReact/common/I18n';
import NewTemplateSyncForm from './components/NewTemplateSyncForm/NewTemplateSyncForm';
import { TemplateSyncContext } from '../TemplateSyncContext';

export const NewTemplateSync = () => {
  const { isLoading } = useContext(TemplateSyncContext);
  return (
    <PageLayout header={__('Import or Export Templates')} searchable={false}>
      {!isLoading && <NewTemplateSyncForm />}
    </PageLayout>
  );
};

export default NewTemplateSync;
