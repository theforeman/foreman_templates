import React from 'react';

import { Button, Breadcrumb } from 'patternfly-react';
import PageLayout from 'foremanReact/pages/common/PageLayout/PageLayout';
import { Link } from 'react-router-dom';
import SyncResultList from './SyncResultList';

const FinishedSyncResult = (props) => {
  const {
    templates,
    type,
    repo,
    branch,
    gitUser,
    pagination,
    pageChange,
    editPaths,
  } = props;

  const composeSubtitle = (repo, branch, gitUser) => {
    const branchString = branch && ` and branch ${branch}` || '';
    const userString = gitUser && ` as user ${gitUser}` || '';
    return `using repo ${repo}${branchString}${userString}`;
  }

  return (
      <PageLayout searchable={false} header={`You tried to ${type} the following templates`}>
        <div className="form-group">
          <h4>{ composeSubtitle(repo, branch, gitUser) }</h4>
        </div>

        <div className="form-group">
          <Link to='/template_syncs'>Go back</Link>
        </div>

        <SyncResultList templates={templates}
                        pagination={pagination}
                        editPaths={editPaths}
                        pageChange={pageChange}/>
      </PageLayout>
  )
}

FinishedSyncResult.propTypes = {
  templates: PropTypes.array,
  type: PropTypes.string,
  repo: PropTypes.string,
  branch: PropTypes.string,
  gitUser: PropTypes.string,
}

export default FinishedSyncResult;
