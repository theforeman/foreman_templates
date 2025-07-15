import React from 'react';
import { registerRoutes } from 'foremanReact/routes/RoutingService';
import { SYNC_BASE_URL } from './consts';
import ProtectedComponent from './ProtectedComponent';

const globalRoutes = [
  {
    path: `/${SYNC_BASE_URL}*`,
    exact: true,
    render: props => <ProtectedComponent {...props} />,
  },
];

registerRoutes('foreman_templates', globalRoutes);
