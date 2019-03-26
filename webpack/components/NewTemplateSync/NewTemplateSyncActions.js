import { ajaxRequestAction } from 'foremanReact/redux/actions/common';
import api from 'foremanReact/API';

import {
  SYNC_SETTINGS_REQUEST,
  SYNC_SETTINGS_SUCCESS,
  SYNC_SETTINGS_FAILURE
} from '../../consts';

import { deepPropsToCamelCase } from '../../helpers';

export const getSyncSettings = url => dispatch => {
  dispatch({ type: SYNC_SETTINGS_REQUEST });
  return api.get(url)
    .then(({ data }) =>
      dispatch({
        type: SYNC_SETTINGS_SUCCESS,
        payload: {
          ...deepPropsToCamelCase(data),
        },
      })
    )
    .catch(error => dispatch(errorHandler(SYNC_SETTINGS_FAILURE, error)));
}
