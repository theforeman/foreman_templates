import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import SyncedTemplate from '../SyncedTemplate';
import {
  noName,
  epel,
  coreos,
  filteredOut,
} from '../../__fixtures__/templateSyncResult.fixtures';

const fixtures = {
  'should render template with invalid metadata': {
    template: noName,
    editPath: '',
  },
  'should render template with validation errors': {
    template: epel,
    editPath: '/templates/:id/edit',
  },
  'should render template without errros': {
    template: coreos,
    editPath: '/ptables/:id/edit',
  },
  'should render skipped template': {
    template: filteredOut,
    editPath: '/ptables/:id/edit',
  },
};

describe('SyncedTemplate', () =>
  testComponentSnapshotsWithFixtures(SyncedTemplate, fixtures));
