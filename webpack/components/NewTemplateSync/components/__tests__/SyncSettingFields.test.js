import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SyncSettingFields from '../SyncSettingFields';

import { importSettings, exportSettings } from '../../__fixtures__/templateSyncSettings.fixtures'

const noop = () => {};

const commonFixtures = {
  importSettings,
  exportSettings,
  resetField: noop,
  disabled: false,
}

const fixtures = {
  'should show export settings': {
    syncType: 'export',
    validationData: {},
    ...commonFixtures
  },
  'should show import settings': {
    syncType: 'import',
    validationData: { 'repo': ['http', 'https'] },
    ...commonFixtures
  },
};

describe('SyncSettingFields', () =>
  testComponentSnapshotsWithFixtures(SyncSettingFields, fixtures));
