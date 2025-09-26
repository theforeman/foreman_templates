import React from 'react';
import TemplateSyncResult from '../components/TemplateSyncResult';
import PageNotFound from '../components/PageNotFound';
import { NewTemplateSync } from '../components/NewTemplateSync';
import protectedComponent from './ProtectedComponent';
import TemplatesRouter from './TemplatesRouter';
import { SYNC_BASE_URL, SYNC_RESULT_URL } from '../consts';

export const localRoutes = [
  {
    title: 'New Template Sync',
    path: SYNC_BASE_URL,
    Component: protectedComponent(NewTemplateSync),
  },
  {
    title: 'Template Sync Result',
    path: SYNC_RESULT_URL,
    Component: protectedComponent(TemplateSyncResult),
  },
  {
    title: 'Page not found',
    path: `${SYNC_BASE_URL}*`,
    Component: PageNotFound,
  },
];

export const globalRoutes = [
  {
    path: `/${SYNC_BASE_URL}*`,
    exact: true,
    render: props => <TemplatesRouter {...props} />,
  },
];
