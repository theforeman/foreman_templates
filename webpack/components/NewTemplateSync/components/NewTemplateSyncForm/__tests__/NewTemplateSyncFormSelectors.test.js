import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import { formName } from '../NewTemplateSyncFormConstants';
import {
  registeredImportSettings,
  initialValues,
  stateFactory,
  importSettings,
  exportSettings,
} from '../../../__fixtures__/templateSyncSettings.fixtures';

import {
  selectInitialFormValues,
  selectRegisteredFields,
} from '../NewTemplateSyncFormSelectors';

const formStateFactory = obj => ({
  form: {
    [formName]: obj,
  },
});

const fixtures = {
  'should return registered fields': () =>
    selectRegisteredFields(
      formName,
      formStateFactory(registeredImportSettings)
    ),
  'should return initial form values': () =>
    selectInitialFormValues({
      ...stateFactory({ importSettings, exportSettings }),
      ...formStateFactory(initialValues),
    }),
};

describe('NewTemplateSyncFormSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
