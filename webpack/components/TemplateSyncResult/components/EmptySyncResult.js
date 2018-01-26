import React from 'react';
import { EmptyState, Button } from 'patternfly-react';

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
}

export default EmptySyncResult;
