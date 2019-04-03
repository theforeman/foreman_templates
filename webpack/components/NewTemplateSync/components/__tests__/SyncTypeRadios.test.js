import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SyncTypeRadios from '../SyncTypeRadios';

const noop = () => {};

const fixtures = {
  'should render': {
    controlLabel: 'Test radios',
    radios: [
      { label: 'A', checked: false, value: 'a', onChange: noop },
      { label: 'B', checked: true, value: 'b', onChange: noop },
      { label: 'C', checked: false, value: 'c', onChange: noop },
    ]
  },
};

describe('SyncTypeRadios', () =>
  testComponentSnapshotsWithFixtures(SyncTypeRadios, fixtures));
