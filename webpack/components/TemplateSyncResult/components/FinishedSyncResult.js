import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';

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
  editPaths,
  redirectBack,
}) => (
  <PageLayout
    searchable={false}
    header={titleString(type, repo, branch, gitUser, fileRepoStartWith)}
  >
    <div id="foreman-templates">
      <Flex>
        <FlexItem align={{ default: 'alignRight' }}>
          <Button
            className="back_button"
            ouiaId="back"
            variant="secondary"
            onClick={redirectBack}
          >
            {__('Back to sync form')}
          </Button>
        </FlexItem>
      </Flex>
      <SyncResultList
        className="margin-top-xl"
        templates={templates}
        editPaths={editPaths}
      />
    </div>
  </PageLayout>
);

FinishedSyncResult.propTypes = {
  branch: PropTypes.string,
  editPaths: PropTypes.object.isRequired,
  fileRepoStartWith: PropTypes.array.isRequired,
  gitUser: PropTypes.string,
  redirectBack: PropTypes.func.isRequired,
  repo: PropTypes.string.isRequired,
  templates: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

FinishedSyncResult.defaultProps = {
  branch: '',
  gitUser: '',
};

export default FinishedSyncResult;
