import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateFooter,
  EmptyStateActions,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

const EmptySyncResult = ({ primaryAction }) => (
  <EmptyState>
    <EmptyStateHeader icon={<EmptyStateIcon icon={SearchIcon} />}>
      {__('No Template Sync Result')}
    </EmptyStateHeader>
    <EmptyStateBody>
      {__(
        'To view results of a template sync, you must import/export the templates first.'
      )}
    </EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateActions>
        <Button ouiaId="back" onClick={primaryAction}>
          {__('Sync Templates')}
        </Button>
      </EmptyStateActions>
    </EmptyStateFooter>
  </EmptyState>
);

EmptySyncResult.propTypes = {
  primaryAction: PropTypes.func.isRequired,
};

export default EmptySyncResult;
