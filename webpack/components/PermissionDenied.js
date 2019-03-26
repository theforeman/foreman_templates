import React from 'react';
import { EmptyStatePattern as EmptyState } from 'foremanReact/components/common/EmptyState';

const PermissionDenied = props => {
  const description = (
    <span>
      {__('You are not authorized to perform this action.')}
      <br />
      {__(
        'Please request one of the required permissions listed below from a Foreman administrator:'
      )}
      <br />
    </span>
  );

  return (
    <EmptyState
      iconType="fa"
      icon="lock"
      header={__('Permission Denied')}
      description={description}
      documentation={props.doc}
    />
  );
};

export default PermissionDenied;
