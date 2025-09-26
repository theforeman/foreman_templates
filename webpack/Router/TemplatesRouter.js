import React from 'react';
import { Router, Route, Switch, useHistory } from 'react-router-dom';
import { TemplateSyncContextWrapper } from '../components/TemplateSyncContext';
import { localRoutes } from './routes';

const TemplatesRouter = () => {
  const history = useHistory();

  return (
    <Router history={history}>
      <TemplateSyncContextWrapper>
        <Switch>
          {localRoutes.map(({ path, Component }) => (
            <Route
              exact
              key={path}
              path={`/${path}`}
              render={props => <Component {...props} />}
            />
          ))}
        </Switch>
      </TemplateSyncContextWrapper>
    </Router>
  );
};

export default TemplatesRouter;
