import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const PageNotFound = () => (
  <EmptyState>
    <EmptyStateHeader
      titleText={__('Page Not Found')}
      icon={<EmptyStateIcon icon={ExclamationTriangleIcon} />}
    />
    <EmptyStateBody>
      {__('The page you are looking for does not exist')}
    </EmptyStateBody>
  </EmptyState>
);

export default PageNotFound;
