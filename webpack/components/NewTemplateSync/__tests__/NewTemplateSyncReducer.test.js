import { testReducerSnapshotWithFixtures } from '@theforeman/test';

import reducer, { initialState } from '../NewTemplateSyncReducer';

import {
  importSettings,
  exportSettings,
} from '../__fixtures__/templateSyncSettings.fixtures';
import {
  SYNC_SETTINGS_REQUEST,
  SYNC_SETTINGS_SUCCESS,
  SYNC_SETTINGS_FAILURE,
} from '../../../consts';

const successPayload = {
  results: {
    import: importSettings,
    export: exportSettings,
  },
};

const fixtures = {
  'should return initial state': {
    state: initialState,
    action: {
      type: undefined,
      payload: {},
    },
  },
  'should start loading on setting values request': {
    state: initialState,
    action: {
      type: SYNC_SETTINGS_REQUEST,
    },
  },
  'should stop loading on setting values success': {
    state: initialState.set('loadingSettings', true),
    action: {
      type: SYNC_SETTINGS_SUCCESS,
      payload: successPayload,
    },
    'should stop loading on setting values error': {
      state: initialState.set('loadingSettings', true),
      action: {
        type: SYNC_SETTINGS_FAILURE,
        payload: {
          error: 'Failed to fetch setting values',
        },
      },
    },
  },
};

describe('NewTemplateSyncReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
