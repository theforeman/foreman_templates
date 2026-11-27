import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

const EmptySyncResult = ({ primaryAction }) => (
  <EmptyState
    headingLevel="h1"
    icon={SearchIcon}
    titleText={__('No Template Sync Result')}
  >
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
