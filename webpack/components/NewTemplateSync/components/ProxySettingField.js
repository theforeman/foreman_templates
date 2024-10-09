import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { FieldLevelHelp } from 'patternfly-react';
import RenderField from './TextButtonField/RenderField';
import ButtonTooltip from './ButtonTooltip';

import {
  tooltipContent,
  label,
} from './NewTemplateSyncForm/NewTemplateSyncFormHelpers';

const ProxySettingField = ({ setting, resetField, field, form, fieldName }) => (
  <RenderField
    label={label(setting)}
    fieldSelector={_ => 'select'}
    tooltipHelp={<FieldLevelHelp content={tooltipContent(setting)} />}
    buttonAttrs={{
      buttonText: <ButtonTooltip tooltipId={fieldName} />,
      buttonAction: () =>
        resetField(fieldName, setting.value)(form.setFieldValue),
    }}
    blank={{}}
    item={setting}
    disabled={false}
    fieldRequired
    meta={{
      touched: get(form.touched, fieldName),
      error: get(form.errors, fieldName),
    }}
    input={field}
  />
);

ProxySettingField.propTypes = {
  setting: PropTypes.object.isRequired,
  resetField: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
};

export default ProxySettingField;
