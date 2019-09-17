import api from 'foremanReact/API';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';

import {
  SYNC_SETTINGS_REQUEST,
  SYNC_SETTINGS_SUCCESS,
  SYNC_SETTINGS_FAILURE,
} from '../../consts';

export const getSyncSettings = url => async dispatch => {
  dispatch({ type: SYNC_SETTINGS_REQUEST });

  try {
    const { data } = await api.get(url);
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
