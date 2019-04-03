import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SyncResultList from '../SyncResultList';
import { importTemplates } from '../../__fixtures__/templateSyncResult.fixtures';


const noop = () => {};

const editPaths = {
  'JobTemplate': '',
  'Ptable': '',
  'ProvisioningTemplate': ''
}

const fixtures = {
  'should render': {
    pageChange: noop,
    templates: importTemplates,
    editPaths,
    pagination: {
      page: 1,
      perPage: 20
    }
  }
}

describe('SyncResultList', () =>
  testComponentSnapshotsWithFixtures(SyncResultList, fixtures));
