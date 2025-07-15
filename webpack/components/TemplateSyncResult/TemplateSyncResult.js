import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Skeleton } from '@patternfly/react-core';
import EmptySyncResult from './components/EmptySyncResult';
import FinishedSyncResult from './components/FinishedSyncResult';

import './TemplateSyncResult.scss';
import { SYNC_BASE_URL } from '../../consts';

const TemplateSyncResult = ({
  setView,
  apiResponse,
  receivedTemplates,
  isTemplatesLoading,
}) => {
  const redirectBack = () => setView(SYNC_BASE_URL);

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

TemplateSyncResult.propTypes = {
  setView: PropTypes.func.isRequired,
  apiResponse: PropTypes.object.isRequired,
  receivedTemplates: PropTypes.object,
  isTemplatesLoading: PropTypes.bool.isRequired,
};

TemplateSyncResult.defaultProps = {
  receivedTemplates: null,
};
