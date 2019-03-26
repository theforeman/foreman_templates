import React from 'react';

import {
  propsToCamelCase,
} from 'foremanReact/common/helpers';

export const deepPropsToCamelCase = obj => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepPropsToCamelCase);
  }
  const transformed = propsToCamelCase(obj);
  return Object.keys(transformed).reduce((memo, key) => {
    memo[key] = deepPropsToCamelCase(transformed[key]);
    return memo;
  }, {})
};

// TODO: extract to core
export const withProtectedView = (
  ProtectedComponent,
  ProtectionComponent,
  protectionFn,
  extraProtectionProps = {}
) => props =>
  protectionFn(props) ? (
    <ProtectedComponent {...props} />
  ) : (
    <ProtectionComponent {...props} {...extraProtectionProps}/>
  );

export default withProtectedView;
