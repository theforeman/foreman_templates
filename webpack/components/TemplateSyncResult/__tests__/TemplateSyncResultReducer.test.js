import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import reducer, { initialState } from '../TemplateSyncResultReducer';
import { importTemplates } from '../__fixtures__/templateSyncResult.fixtures';

import {
  TEMPLATESYNC_FORM_SUBMITTED,
  SYNC_RESULT_PAGINATION_CHANGE
} from '../../../consts';

const fixtures = {
  'should return initial state': {
    state: initialState,
    action: {
      type: undefined,
      payload: {}
    }
  },
  'should set new pagination': {
    state: initialState,
    action: {
      type: SYNC_RESULT_PAGINATION_CHANGE,
      payload: {
        pagination: {
          page: 2,
          perPage: 5
        }
      }
    }
  },
  'should update state when form submitted': {
    state: initialState,
    action: {
      type: TEMPLATESYNC_FORM_SUBMITTED,
      payload: {
        data: {
          templates: importTemplates,
          repo: 'https://github.com/theforeman/community-templates.git',
          branch: 'master',
          result_action: 'import',
        }
      }
    }
  }
}

describe('TemplateSyncResultReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
