import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import NewTemplateSync from '../NewTemplateSync';

jest.mock('foremanReact/routes/common/PageLayout/PageLayout');

const noop = () => {};

const commonFixture = {
  apiUrls: {},
  getSyncSettings: noop,
  validationData: {},
  userPermissions: {
    import: true,
    export: true,
  },
};

const fixtures = {
  'should render when loaded': {
    loadingSettings: false,
    ...commonFixture,
  },
  'should render when loading': {
    loadingSettings: true,
    ...commonFixture,
  },
};

describe('NewTemplateSync', () =>
  testComponentSnapshotsWithFixtures(NewTemplateSync, fixtures));
