import React, { useEffect, useState, createContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { APIActions } from 'foremanReact/redux/API';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';
import { SYNC_SETTINGS_REQUEST, SYNC_SETTINGS_URL } from '../consts';

export const TemplateSyncContext = createContext();

export const TemplateSyncContextWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);

  const [receivedTemplates, setReceivedTemplates] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    if (receivedTemplates !== null) {
      setIsTemplatesLoading(false);
    }
  }, [receivedTemplates]);

  useEffect(() => {
    if (apiResponse !== null) return;
    dispatch(
      APIActions.get({
        key: SYNC_SETTINGS_REQUEST,
        url: `/${SYNC_SETTINGS_URL}`,
        handleSuccess: response => {
          const { editPaths } = response.data;
          setApiResponse({
            ...deepPropsToCamelCase(response.data),
            editPaths,
          });
          setIsLoading(false);
        },
        handleError: () => setIsLoading(false),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TemplateSyncContext.Provider
      value={{
        setIsTemplatesLoading,
        isTemplatesLoading,
        receivedTemplates,
        setReceivedTemplates,
        apiResponse,
        isLoading,
        dispatch,
        history,
      }}
    >
      {children}
    </TemplateSyncContext.Provider>
  );
};

TemplateSyncContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
