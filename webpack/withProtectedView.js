import React from 'react';

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
    <ProtectionComponent {...props} {...extraProtectionProps} />
  );

export default withProtectedView;
