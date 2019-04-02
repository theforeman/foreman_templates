import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NewTemplateSync from './components/NewTemplateSync';
import TemplateSyncResult from './components/TemplateSyncResult';
import PageNotFound from './components/PageNotFound';

const links = [
  {
    title: 'New Template Sync',
    path: 'template_syncs',
    Component: NewTemplateSync,
  },
  {
    title: 'Template Sync Result',
    path: 'template_syncs/result',
    Component: TemplateSyncResult,
  }
];

export default (data) => {
  return (
    <Switch>
      {links.map(({ path, Component }) => (
        <Route exact key={path} path={`/${path}`} render={(props) => <Component {...props} {...data} />} />
      ))}
      <Route component={PageNotFound} />
    </Switch>
)};
