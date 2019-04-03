import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import { importTemplates, exportTemplates } from '../__fixtures__/templateSyncResult.fixtures';
import TemplateSyncResult from '../TemplateSyncResult';

const fixtures = {
  'should render export result': {
    syncResult: {
      resultAction: 'export',
      templates: exportTemplates,
      repo: 'https://github.com/theforeman/community-templates.git',
      branch: 'master',
      gitUser: 'Admin',
    },
  },
  'should render empty state when no templates synced': {
    syncResult: {
      templates: []
    },
  },
  'should render import result': {
    syncResult: {
      resultAction: 'import',
      templates: importTemplates,
      repo: '/home/vagrant/templates',
    },
  },
};

describe('TemplateSyncResult', () =>
  testComponentSnapshotsWithFixtures(TemplateSyncResult, fixtures));
