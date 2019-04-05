import React from 'react';
import { EmptyStatePattern as EmptyState } from 'foremanReact/components/common/EmptyState';

const PageNotFound = props => (
  <EmptyState
    iconType="fa"
    icon="exclamation-triangle"
    header={__('Page Not Found')}
    description={__('The page you are looking for does not exist')}
  />
);

export default PageNotFound;
