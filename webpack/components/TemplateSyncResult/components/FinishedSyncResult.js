import React from 'react';
import PropTypes from 'prop-types';

import PageLayout from 'foremanReact/pages/common/PageLayout/PageLayout';
import { Link } from 'react-router-dom';
import SyncResultList from './SyncResultList';

const composeSubtitle = (repo, branch, gitUser, fileRepoStartWith) => {
  const isFileRepo = fileRepoStartWith.reduce(
    (memo, item) => repo.startsWith(item) || memo,
    false
  );
  const branchString = branch && !isFileRepo ? ` and branch ${branch}` : '';
  const userString = (gitUser && ` as user ${gitUser}`) || '';
  return `using repo ${repo}${branchString}${userString}`;
};

const FinishedSyncResult = ({
  templates,
  type,
  repo,
  branch,
  gitUser,
  fileRepoStartWith,
  pagination,
  pageChange,
  editPaths,
}) => (
  <PageLayout
    searchable={false}
    header={`You tried to ${type} the following templates`}
  >
    <div className="form-group">
      <h4>{composeSubtitle(repo, branch, gitUser, fileRepoStartWith)}</h4>
    </div>

    <div className="form-group">
      <Link to="/template_syncs">{__('Back')}</Link>
    </div>

    <SyncResultList
      templates={templates}
      pagination={pagination}
      editPaths={editPaths}
      pageChange={pageChange}
    />
  </PageLayout>
);

FinishedSyncResult.propTypes = {
  templates: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  branch: PropTypes.string,
  gitUser: PropTypes.string,
  pagination: PropTypes.object,
  pageChange: PropTypes.func.isRequired,
  editPaths: PropTypes.object.isRequired,
  fileRepoStartWith: PropTypes.array.isRequired,
};

FinishedSyncResult.defaultProps = {
  branch: '',
  gitUser: '',
  pagination: {},
};

export default FinishedSyncResult;
