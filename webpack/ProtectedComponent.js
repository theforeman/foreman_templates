import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { APIActions } from 'foremanReact/redux/API';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';
import { Skeleton } from '@patternfly/react-core';
import PermissionDenied from 'foremanReact/components/PermissionDenied';
import { NewTemplateSync } from './components/NewTemplateSync';
import { SYNC_SETTINGS_REQUEST, SYNC_SETTINGS_URL } from './consts';

const ProtectedComponent = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState(null);
  const dispatch = useDispatch();

  const requiredPermissions = ['import_templates', 'export_templates'];

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

  const perms = apiResponse?.userPermissions ?? true;

  if (!perms || isLoading)
    return <Skeleton height="100%" screenreaderText="Loading ..." />;

  return perms?.import || perms?.export ? (
    <NewTemplateSync apiResponse={apiResponse} />
  ) : (
    <PermissionDenied missingPermissions={requiredPermissions} />
  );
};

export default ProtectedComponent;
