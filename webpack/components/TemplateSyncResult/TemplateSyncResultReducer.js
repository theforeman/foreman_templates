import Immutable from 'seamless-immutable';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';

import {
  TEMPLATESYNC_FORM_SUBMITTED,
  SYNC_RESULT_PAGINATION_CHANGE,
} from '../../consts';

export const initialState = Immutable({
  resultAction: '',
  templates: [],

  pagination: {
    page: 1,
    perPage: 20,
  },
});

const syncResult = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case TEMPLATESYNC_FORM_SUBMITTED:
      return state.merge({
        ...deepPropsToCamelCase(payload.data),
      });
    case SYNC_RESULT_PAGINATION_CHANGE:
      return state.set('pagination', payload.pagination);
    default:
      return state;
  }
};

export default syncResult;
