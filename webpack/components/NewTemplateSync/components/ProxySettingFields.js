import React from 'react';
import PropTypes from 'prop-types';

import { Formik, Field as FormikField } from 'formik';
import ProxySettingField from './ProxySettingField';

const ProxySettingsFields = ({
  proxySettings,
  syncType,
  resetField,
  formProps: { isSubmitting },
}) => {
  const emptySetting = {
    description: '',
    selection: [],
    value: '',
    fullName: '',
  };
  const proxyPolicySetting = proxySettings[0] || emptySetting;
  const proxyIdSetting = proxySettings[1] || emptySetting;
  const proxyPolicyFieldName = `${syncType}.httpProxyPolicy`;
  const proxyIdFieldName = `${syncType}.httpProxyId`;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        [syncType]: {
          http_proxy_policy: proxyPolicySetting.value,
        },
      }}
    >
      <div>
        <FormikField
          name={proxyPolicyFieldName}
          render={({ field, form }) => (
            <ProxySettingField
              setting={proxyPolicySetting}
              resetField={resetField}
              field={field}
              form={form}
              fieldName={proxyPolicyFieldName}
              key={proxyPolicySetting.name}
            />
          )}
        />
        <FormikField
          name={proxyIdFieldName}
          render={({ field, form }) => {
            if (form.values[syncType]?.httpProxyPolicy === 'selected') {
              return (
                <ProxySettingField
                  setting={proxyIdSetting}
                  resetField={resetField}
                  field={field}
                  form={form}
                  fieldName={proxyIdFieldName}
                  key={proxyIdSetting.name}
                />
              );
            }
            return <></>;
          }}
        />
      </div>
    </Formik>
  );
};

ProxySettingsFields.propTypes = {
  proxySettings: PropTypes.array.isRequired,
  syncType: PropTypes.string.isRequired,
  resetField: PropTypes.func.isRequired,
  formProps: PropTypes.object,
};

ProxySettingsFields.defaultProps = {
  formProps: {},
};

export default ProxySettingsFields;
