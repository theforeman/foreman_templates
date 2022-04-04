import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import SyncTypeRadios from '../SyncTypeRadios';

const noop = () => {};

const fixtures = {
  'should render': {
    controlLabel: 'Test radios',
    name: 'radios',
    radios: [
      { label: 'A', checked: false, value: 'a', onChange: noop },
      { label: 'B', checked: true, value: 'b', onChange: noop },
      { label: 'C', checked: false, value: 'c', onChange: noop },
    ],
  },
};

describe('SyncTypeRadios', () =>
  testComponentSnapshotsWithFixtures(SyncTypeRadios, fixtures));
