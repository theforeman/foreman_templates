import React from 'react';
import PropTypes from 'prop-types';
import { Field as FormikField } from 'formik';

import ProxySettingField from './ProxySettingField';

const ProxySettingsFields = ({
  proxyPolicySetting,
  proxyIdSetting,
  syncType,
  resetField,
  formProps: { isSubmitting },
}) => {
  if (Object.keys(proxyPolicySetting).length === 0) {
    return <></>;
  }
  const proxyPolicyFieldName = `${syncType}.http_proxy_policy`;
  const proxyIdFieldName = `${syncType}.http_proxy_id`;

  // removes the custom proxy option if no proxy is available
  if (proxyIdSetting.value === '') {
    proxyPolicySetting = proxyPolicySetting.set(
      'selection',
      proxyPolicySetting.selection.slice(0, 2)
    );
  }

  return (
    <React.Fragment>
      <FormikField
        name={proxyPolicyFieldName}
        render={({ field, form }) => {
          if (isHttpUrl(form.values[syncType]?.repo))
            return (
              <ProxySettingField
                setting={proxyPolicySetting}
                resetField={resetField}
                field={field}
                form={form}
                fieldName={proxyPolicyFieldName}
              />
            );
          return <></>;
        }}
      />
      <FormikField
        name={proxyIdFieldName}
        render={({ field, form }) => {
          if (
            isHttpUrl(form.values[syncType]?.repo) &&
            proxyIdSetting.value !== '' &&
            // Changing name to camel case here would unnecessarily complicate the code
            // eslint-disable-next-line camelcase
            form.values[syncType]?.http_proxy_policy === 'selected'
          ) {
            return (
              <ProxySettingField
                setting={proxyIdSetting}
                resetField={resetField}
                field={field}
                form={form}
                fieldName={proxyIdFieldName}
              />
            );
          }
          return <></>;
        }}
      />
    </React.Fragment>
  );
};

const isHttpUrl = value => value && /^(https?:\/\/)/.test(value);

ProxySettingsFields.propTypes = {
  proxyPolicySetting: PropTypes.object,
  proxyIdSetting: PropTypes.object,
  syncType: PropTypes.string.isRequired,
  resetField: PropTypes.func.isRequired,
  formProps: PropTypes.object,
};

ProxySettingsFields.defaultProps = {
  formProps: {},
  proxyPolicySetting: {},
  proxyIdSetting: {},
};

export default ProxySettingsFields;
