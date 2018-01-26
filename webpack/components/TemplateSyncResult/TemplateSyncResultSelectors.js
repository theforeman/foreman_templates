// move to some sort of pagination helper in core
export const templatesPage = (templates, pagination) => {
  const offset = (pagination.page - 1) * pagination.perPage;

  return templates.slice(offset, offset + pagination.perPage);
};

export const selectSyncResult = state => state.foreman_templates.syncResult;
