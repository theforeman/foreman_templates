import { SYNC_RESULT_PAGINATION_CHANGE } from '../../consts';

export const syncedTemplatesPageChange = pagination => dispatch => {
  return dispatch({ type: SYNC_RESULT_PAGINATION_CHANGE, payload: { pagination } });
}
