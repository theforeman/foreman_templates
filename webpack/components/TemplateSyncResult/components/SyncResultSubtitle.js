import React from 'react';

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

export default SyncResultSubtitle;
