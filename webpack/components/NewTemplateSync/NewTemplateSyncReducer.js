import Immutable from 'seamless-immutable';

import {
  SYNC_SETTINGS_REQUEST,
  SYNC_SETTINGS_SUCCESS,
  SYNC_SETTINGS_FAILURE,
} from '../../consts';

const initialState = Immutable({
  loadingSettings: false,
  importSettings: [],
  exportSettings: [],
  error: ''
});

const syncSettings = (state = initialState, action) => {
  const { payload } = action;
  switch(action.type) {
    case SYNC_SETTINGS_REQUEST:
      return state.set('loadingSettings', true);
    case SYNC_SETTINGS_SUCCESS:
      return state.merge({
        'loadingSettings': false,
        'importSettings': payload.results.import,
        'exportSettings': payload.results.export
      });
    case SYNC_SETTINGS_FAILURE:
      return state.set({ error: payload.error}).set({ loadingSettings: false });
    default:
      return state;
  }
}

export default syncSettings;
