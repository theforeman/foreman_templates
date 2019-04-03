import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import { importSettings, exportSettings, stateFactory } from '../__fixtures__/templateSyncSettings.fixtures';

import {
  selectImportSettings,
  selectExportSettings,
  selectLoadingSettings,
  selectError,
} from '../NewTemplateSyncSelectors';

const fixtures = {
  'should return import settings': () =>
    selectImportSettings(stateFactory({ importSettings })),
  'should return export settings': () =>
    selectExportSettings(stateFactory({ exportSettings })),
  'should return loading settings': () =>
    selectLoadingSettings(stateFactory({ loadingSettings: true })),
  'should return loading error': () =>
    selectError(stateFactory({ error: 'Error'})),
}

describe('NewTemplateSyncSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
