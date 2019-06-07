import { createSelector } from 'reselect';

import {
  selectImportSettings,
  selectExportSettings,
} from '../../NewTemplateSyncSelectors';

export const transformInitialValues = settings =>
  settings.reduce(
    (memo, item) => Object.assign(memo, { [item.name]: item.value }),
    {}
  );

export const selectInitialFormValues = createSelector(
  selectImportSettings,
  selectExportSettings,
  (importSettings, exportSettings) => ({
    import: transformInitialValues(importSettings),
    export: transformInitialValues(exportSettings),
  })
);
