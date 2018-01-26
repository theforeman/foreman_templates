import { createSelector } from 'reselect';

import { selectImportSettings, selectExportSettings } from '../../NewTemplateSyncSelectors';

export const selectInitialFormValues = createSelector(
  selectImportSettings,
  selectExportSettings,
  (importSettings, exportSettings) =>
    importSettings.concat(exportSettings)
                  .reduce((memo, item) => Object.assign(memo, { [item.name]: item.value }), {})
);
