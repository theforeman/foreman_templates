import api from 'foremanReact/API';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';

import {
  SYNC_SETTINGS_REQUEST,
  SYNC_SETTINGS_SUCCESS,
  SYNC_SETTINGS_FAILURE,
  SYNC_RESULT_PAGINATION_CHANGE,
} from '../../consts';

import { initialState } from '../TemplateSyncResult/TemplateSyncResultReducer';

export const getSyncSettings = url => async dispatch => {
  dispatch({ type: SYNC_SETTINGS_REQUEST });

  try {
    const { data } = await api.get(url);
    dispatch({
      type: SYNC_RESULT_PAGINATION_CHANGE,
      payload: { pagination: initialState.pagination },
    });
    return dispatch({
      type: SYNC_SETTINGS_SUCCESS,
      payload: {
        ...deepPropsToCamelCase(data),
      },
    });
  } catch (error) {
    return dispatch(errorHandler(SYNC_SETTINGS_FAILURE, error));
  }
};

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: 'Failed to fetch Settings for template sync from server.',
    statusText: err.response.statusText,
  };
  return { type: msg, payload: { error } };
};
