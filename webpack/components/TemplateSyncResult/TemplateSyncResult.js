import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import { Skeleton } from '@patternfly/react-core';
import EmptySyncResult from './components/EmptySyncResult';
import FinishedSyncResult from './components/FinishedSyncResult';

import './TemplateSyncResult.scss';
import { TemplateSyncContext } from '../TemplateSyncContext';

const TemplateSyncResult = () => {
  const {
    history,
    apiResponse,
    receivedTemplates,
    isTemplatesLoading,
  } = useContext(TemplateSyncContext);

  const redirectBack = () => history.push({ pathname: '/template_syncs' });

  if (isTemplatesLoading)
    return <Skeleton height="100%" screenreaderText="Loading ..." />;

  if (!receivedTemplates)
    return <EmptySyncResult primaryAction={redirectBack} />;

  const { editPaths, fileRepoStartWith } = apiResponse;
  const { templates, resultAction, repo, branch, gitUser } = receivedTemplates;

  if (!templates || isEmpty(templates))
    return <EmptySyncResult primaryAction={redirectBack} />;

  return (
    <FinishedSyncResult
      templates={templates}
      type={resultAction}
      repo={repo}
      branch={branch}
      gitUser={gitUser}
      fileRepoStartWith={fileRepoStartWith}
      editPaths={editPaths}
      redirectBack={redirectBack}
    />
  );
};

export default TemplateSyncResult;
