export const newSyncState = state => state.foremanTemplates.syncSettings;

export const selectImportSettings = state => newSyncState(state).importSettings;
export const selectExportSettings = state => newSyncState(state).exportSettings;
export const selectProxySettings = state => newSyncState(state).proxySettings;
export const selectLoadingSettings = state =>
  newSyncState(state).loadingSettings;
export const selectError = state => newSyncState(state).error;
