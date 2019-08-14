import React from 'react';
import PropTypes from 'prop-types';

const SyncResultSubtitle = ({ repo, branch, gitUser, fileRepoStartWith }) => {
  const isFileRepo = fileRepoStartWith.reduce(
    (memo, item) => repo.startsWith(item) || memo,
    false
  );
  const branchString = branch && !isFileRepo ? ` and branch ${branch}` : '';
  const userString = (gitUser && ` as user ${gitUser}`) || '';

  return (
    <div className="form-group">
      <h4>{`using repo ${repo}${branchString}${userString}`}</h4>
    </div>
  );
};

SyncResultSubtitle.propTypes = {
  repo: PropTypes.string,
  branch: PropTypes.string,
  gitUser: PropTypes.string,
  fileRepoStartWith: PropTypes.string,
};

SyncResultSubtitle.defaultProps = {
  repo: '',
  branch: '',
  gitUser: '',
  fileRepoStartWith: '',
};

export default SyncResultSubtitle;
