// move to some sort of pagination helper in core
export const templatesPage = (templates, pagination) => {
  const offset = (pagination.page - 1) * pagination.per_page;

  return templates.slice(offset, offset + pagination.per_page);
};
