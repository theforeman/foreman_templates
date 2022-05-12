import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import SyncSettingField from '../SyncSettingField';

import {
  associateSetting,
  forceSetting,
  filterSetting,
} from '../../__fixtures__/templateSyncSettings.fixtures';

const noop = () => () => {};

const commonFixtures = {
  resetField: noop,
  disabled: false,
  syncType: 'import',
};

const fixtures = {
  'should render setting with select choices': {
    setting: associateSetting,
    ...commonFixtures,
  },
  'should render setting with input field': {
    setting: filterSetting,
    ...commonFixtures,
  },
  'should render boolean setting as checkbox': {
    setting: forceSetting,
    ...commonFixtures,
  },
};

describe('SyncSettingField', () =>
  testComponentSnapshotsWithFixtures(SyncSettingField, fixtures));
