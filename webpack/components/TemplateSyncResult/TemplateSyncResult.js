import React from 'react';
import { isEmpty } from 'lodash';

import EmptySyncResult from './components/EmptySyncResult';
import FinishedSyncResult from './components/FinishedSyncResult';

import './TemplateSyncResult.scss';

const TemplateSyncResult = props => {

  const {
    syncResult: {
      templates,
      resultAction,
      repo,
      branch,
      gitUser,
      pagination
    },
    history,
    syncedTemplatesPageChange,
    editPaths
  } = props;

  const redirectBack = () => history.push({ pathname: '/template_syncs'});

  return (
    <div>
      { isEmpty(templates) ?
          <EmptySyncResult primaryAction={redirectBack}/> :
          <FinishedSyncResult templates={templates}
                              type={resultAction}
                              repo={repo}
                              branch={branch}
                              gitUser={gitUser}
                              editPaths={editPaths}
                              pagination={pagination}
                              pageChange={syncedTemplatesPageChange}/>
      }
    </div>
  )
}

export default TemplateSyncResult;
