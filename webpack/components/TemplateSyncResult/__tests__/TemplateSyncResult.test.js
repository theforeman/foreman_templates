import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import {
  importTemplates,
  exportTemplates,
} from '../__fixtures__/templateSyncResult.fixtures';
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
    history: {},
  },
  'should render empty state when no templates synced': {
    syncResult: {
      templates: [],
    },
    history: {},
  },
  'should render import result': {
    syncResult: {
      resultAction: 'import',
      templates: importTemplates,
      repo: '/home/vagrant/templates',
    },
    history: {},
  },
};

describe('TemplateSyncResult', () =>
  testComponentSnapshotsWithFixtures(TemplateSyncResult, fixtures));
