import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateActions,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

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
    <EmptyState>
      <EmptyStateHeader
        titleText={__('Permission Denied')}
        icon={<EmptyStateIcon icon={LockIcon} />}
      />
      <EmptyStateBody>{description}</EmptyStateBody>
      <EmptyStateActions>
        {props.doc && (
          <Button ouiaId="back" variant="primary">
            {props.doc}
          </Button>
        )}
      </EmptyStateActions>
    </EmptyState>
  );
};

PermissionDenied.propTypes = {
  doc: PropTypes.node,
};

PermissionDenied.defaultProps = {
  doc: null,
};

export default PermissionDenied;
