import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import { NEW_TEMPLATE_SYNC_FORM_NAME } from '../NewTemplateSyncFormConstants';
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
    [NEW_TEMPLATE_SYNC_FORM_NAME]: obj,
  },
});

const fixtures = {
  'should return registered fields': () =>
    selectRegisteredFields(
      NEW_TEMPLATE_SYNC_FORM_NAME,
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
