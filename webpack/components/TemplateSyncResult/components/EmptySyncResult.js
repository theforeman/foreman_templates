import React from 'react';
import { EmptyState, Button } from 'patternfly-react';
import PropTypes from 'prop-types';

const EmptySyncResult = ({ primaryAction }) => {
  return (
    <EmptyState>
      <EmptyState.Icon type="fa" name="refresh"/>
      <EmptyState.Title>No Template Sync Result</EmptyState.Title>
      <EmptyState.Info>
        To view results of a template sync, you must import/export the templates first.
      </EmptyState.Info>
      <EmptyState.Action>
      <Button bsStyle="primary" bsSize="large" onClick={primaryAction}>
        Sync Templates
      </Button>
      </EmptyState.Action>
    </EmptyState>
  )
};

EmptySyncResult.propTypes = {
  primaryAction: PropTypes.func,
};

export default EmptySyncResult;
