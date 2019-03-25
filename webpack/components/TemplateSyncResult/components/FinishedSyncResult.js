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

  const customItem = (props) => {
    return (
      <li>
        <span { ...props} />
      </li>
    )
  }

  const items = [
    { caption: <Link to={'/template_syncs'}>Import or Export Templates</Link>, customItem: customItem, customTitle: 'penene' },
    { caption: "Sync Result" },
  ];

  return (
      <PageLayout
        searchable={false}
        breadcrumbOptions={{ breadcrumbItems: items }}>

        <div className="form-group">
          <h4>{ `You tried to ${type} the templates ${composeSubtitle(repo, branch, gitUser)}` }</h4>
        </div>

        <SyncResultList templates={templates}
                        pagination={pagination}
                        editPaths={editPaths}
                        pageChange={pageChange}/>
      </PageLayout>
  )
}

export default FinishedSyncResult;
