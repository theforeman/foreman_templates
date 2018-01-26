import React from 'react';

import { Button } from 'patternfly-react';
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

  return (
    <div>
      <Title titleText={`You tried to ${type} the following templates`} headingSize='1' />
      <Title titleText={composeSubtitle(repo, branch, gitUser)} headingSize='4' />
      <div className="row title-row">
        <TitleActions>
          <Button onClick={redirectBack}>{ __('Back') }</Button>
        </TitleActions>
      </div>
      <SyncResultList templates={templates}
                      pagination={pagination}
                      pageChange={pageChange}/>
    </div>
  )
}

export default FinishedSyncResult;
