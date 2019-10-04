import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';

import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { LinkContainer } from 'react-router-bootstrap';

import { Button } from 'patternfly-react';
import SyncResultList from './SyncResultList';

const titleString = (type, repo, branch, gitUser, fileRepoStartWith) => {
  const prep = type === 'import' ? 'from' : 'to';
  const isFileRepo = fileRepoStartWith.reduce(
    (memo, item) => repo.startsWith(item) || memo,
    false
  );

  const branchString = branch && !isFileRepo ? `and branch ${branch}` : '';
  const userString = (gitUser && `as user ${gitUser}`) || '';

  return `${capitalize(type)} ${prep} ${repo} ${branchString} ${userString}`;
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
    header={titleString(type, repo, branch, gitUser, fileRepoStartWith)}
  >
    <div className="row">
      <div className="title-filter col-md-4">&nbsp;</div>
      <div id="title_action" className="col-md-8">
        <div className="btn-toolbar pull-right">
          <LinkContainer to="/template_syncs" activeClassName="">
            <Button>{__('Back to sync form')}</Button>
          </LinkContainer>
        </div>
      </div>
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
