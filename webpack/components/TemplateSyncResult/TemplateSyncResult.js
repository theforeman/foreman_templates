import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import EmptySyncResult from './components/EmptySyncResult';
import FinishedSyncResult from './components/FinishedSyncResult';

import './TemplateSyncResult.scss';

const TemplateSyncResult = ({
  syncResult: { templates, resultAction, repo, branch, gitUser, pagination },
  history,
  syncedTemplatesPageChange,
  editPaths,
  fileRepoStartWith,
}) => {

  const redirectBack = () => history.push({ pathname: '/template_syncs' });

  return isEmpty(templates) ? (
    <EmptySyncResult primaryAction={redirectBack} />
  ) : (
    <FinishedSyncResult
      templates={templates}
      type={resultAction}
      repo={repo}
      branch={branch}
      gitUser={gitUser}
      fileRepoStartWith={fileRepoStartWith}
      editPaths={editPaths}
      pagination={pagination}
      pageChange={syncedTemplatesPageChange}
    />
  );
};

TemplateSyncResult.propTypes = {
  syncResult: PropTypes.shape({
    templates: PropTypes.array,
    resultAction: PropTypes.string,
    repo: PropTypes.string,
    branch: PropTypes.string,
    gitUser: PropTypes.string,
    pagination: PropTypes.shape({
      page: PropTypes.number,
      perPage: PropTypes.number,
    }),
    syncedTemplatesPageChange: PropTypes.func,
  }).isRequired,
  history: PropTypes.object.isRequired,
  editPaths: PropTypes.object,
  fileRepoStartWith: PropTypes.array,
  syncedTemplatesPageChange: PropTypes.func,
};

TemplateSyncResult.defaultProps = {
  editPaths: {},
  syncedTemplatesPageChange: () => {},
  fileRepoStartWith: [],
};

export default TemplateSyncResult;
