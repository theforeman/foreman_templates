import React from 'react';
import PropTypes from 'prop-types';

import PageLayout from 'foremanReact/pages/common/PageLayout/PageLayout';
import { Link } from 'react-router-dom';
import SyncResultList from './SyncResultList';

const composeSubtitle = (repo, branch, gitUser) => {
  const branchString = (branch && ` and branch ${branch}`) || '';
  const userString = (gitUser && ` as user ${gitUser}`) || '';
  return `using repo ${repo}${branchString}${userString}`;
};

const FinishedSyncResult = ({
  templates,
  type,
  repo,
  branch,
  gitUser,
  pagination,
  pageChange,
  editPaths,
}) => (
  <PageLayout
    searchable={false}
    header={`You tried to ${type} the following templates`}
  >
    <div className="form-group">
      <h4>{composeSubtitle(repo, branch, gitUser)}</h4>
    </div>

    <div className="form-group">
      <Link to="/template_syncs">Go back</Link>
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
  pagination: PropTypes.object.isRequired,
  pageChange: PropTypes.func.isRequired,
  editPaths: PropTypes.object.isRequired,
};

FinishedSyncResult.defaultProps = {
  branch: '',
  gitUser: '',
};

export default FinishedSyncResult;
