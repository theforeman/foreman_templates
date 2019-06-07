import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  stateFactory,
  importSettings,
  exportSettings,
} from '../../../__fixtures__/templateSyncSettings.fixtures';

import { selectInitialFormValues } from '../NewTemplateSyncFormSelectors';

const fixtures = {
  'should return initial form values': () =>
    selectInitialFormValues({
      ...stateFactory({ importSettings, exportSettings }),
    }),
};

describe('NewTemplateSyncFormSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
