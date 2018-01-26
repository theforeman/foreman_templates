import {
  SYNC_SETTINGS_REQUEST,
  SYNC_SETTINGS_SUCCESS,
  SYNC_SETTINGS_FAILURE
} from '../../consts';

import { ajaxRequestAction } from 'foremanReact/redux/actions/common';

export const getSyncSettings = url => dispatch => {
  return ajaxRequestAction({
    dispatch,
    requestAction: SYNC_SETTINGS_REQUEST,
    successAction: SYNC_SETTINGS_SUCCESS,
    failureAction: SYNC_SETTINGS_FAILURE,
    url,
    item: {}
  });
}
