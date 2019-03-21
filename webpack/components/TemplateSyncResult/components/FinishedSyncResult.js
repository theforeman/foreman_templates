import React from 'react';

import { Button, Breadcrumb } from 'patternfly-react';
import PageLayout from 'foremanReact/pages/common/PageLayout/PageLayout';
import { Link } from 'react-router-dom';
import SyncResultList from './SyncResultList';

import TitleActions from '../../layout/TitleActions';
import Title from '../../layout/Title';

const FinishedSyncResult = (props) => {
  const {
    templates,
    type,
    redirectBack,
    repo,
    branch,
    gitUser,
    pagination,
    pageChange,
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
    <div>
      <PageLayout
        searchable={false}
        breadcrumbOptions={{ breadcrumbItems: items }}>

        <SyncResultList templates={templates}
                        pagination={pagination}
                        pageChange={pageChange}/>
      </PageLayout>
    </div>
  )
}

export default FinishedSyncResult;


// <Title titleText={`You tried to ${type} the following templates`} headingSize='1' />
//       <Title titleText={composeSubtitle(repo, branch, gitUser)} headingSize='4' />
//       <div className="row title-row">
//         <TitleActions>
//           <Button onClick={redirectBack}>{ __('Back') }</Button>
//         </TitleActions>
//       </div>