import { combineReducers } from 'redux';

import syncSettings from './components/NewTemplateSync/NewTemplateSyncReducer';
import syncResult from './components/TemplateSyncResult/TemplateSyncResultReducer';

export default combineReducers({ syncSettings, syncResult });
