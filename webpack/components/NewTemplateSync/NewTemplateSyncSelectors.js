import { createSelector } from 'reselect';

export const newSyncState = state => state.foreman_templates.syncSettings;

export const selectImportSettings = state => newSyncState(state).importSettings;
export const selectExportSettings = state => newSyncState(state).exportSettings;
export const selectLoadingSettings = state => newSyncState(state).loadingSettings;
export const selectError = state => newSyncState(state).error;
