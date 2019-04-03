import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import NewTemplateSyncForm from '../NewTemplateSyncForm';

import { importSettings, exportSettings } from '../../../__fixtures__/templateSyncSettings.fixtures';

const noop = () => {};

const commonFixture = {
  importUrl: '/import',
  exportUrl: '/export',
  validationData: {},
  userPermissions: {
    import: true,
    export: true,
  },
  handleSubmit: noop,
  valid: true,
  importSettings,
  exportSettings,
};

const fixtures = {
  'should render when for import settings': {
    loadingSettings: false,
    ...commonFixture
  },
  'should render for export settings': {
    loadingSettings: true,
    ...commonFixture,
    userPermissions: {
      import: false,
      export: true,
    }
  },
};

describe('NewTemplateSyncForm', () =>
  testComponentSnapshotsWithFixtures(NewTemplateSyncForm, fixtures));
