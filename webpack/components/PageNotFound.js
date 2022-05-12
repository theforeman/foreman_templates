import React from 'react';
import { EmptyStatePattern as EmptyState } from 'foremanReact/components/common/EmptyState';
import { translate as __ } from 'foremanReact/common/I18n';

const PageNotFound = props => (
  <EmptyState
    iconType="fa"
    icon="exclamation-triangle"
    header={__('Page Not Found')}
    description={__('The page you are looking for does not exist')}
  />
);

export default PageNotFound;
