import { createSelector } from 'reselect';

import { selectImportSettings, selectExportSettings } from '../../NewTemplateSyncSelectors';

export const selectInitialFormValues = createSelector(
  selectImportSettings,
  selectExportSettings,
  (importSettings, exportSettings) =>
    importSettings.concat(exportSettings)
                  .reduce((memo, item) => Object.assign(memo, { [item.name]: item.value }), {})
);

const selectFormState = (formName, state) => {
  return state.form && state.form[formName] ? state.form[formName] : {};
}

export const selectRegisteredFields = (formName, state) =>
  selectFormState(formName, state).registeredFields || {};
