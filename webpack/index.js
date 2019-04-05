import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ForemanTemplates from './ForemanTemplates';
import templateSyncReducer from './reducer';

componentRegistry.register({
  name: 'ForemanTemplates',
  type: ForemanTemplates,
});

injectReducer('foremanTemplates', templateSyncReducer);
