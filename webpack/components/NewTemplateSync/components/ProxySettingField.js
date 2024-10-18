import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { FieldLevelHelp } from 'patternfly-react';
import RenderField from './TextButtonField/RenderField';
import ButtonTooltip from './ButtonTooltip';

//  import { tooltipContent, label, } from './NewTemplateSyncForm/NewTemplateSyncFormHelpers';

const ProxySettingField = ({ setting, resetField, field, form, fieldName }) => (
  <RenderField
    // FIXME: make translation work
    // label={label(setting)}
    label={setting.fullName}
    fieldSelector={_ => 'select'}
    // FIXME: make translation work
    // tooltipHelp={<FieldLevelHelp content={tooltipContent(setting)} />}
    tooltipHelp={<FieldLevelHelp content={setting.description} />}
    buttonAttrs={{
      buttonText: <ButtonTooltip tooltipId={fieldName} />,
      buttonAction: () =>
        resetField(fieldName, setting.value)(form.setFieldValue),
    }}
    blank={{}}
    item={setting}
    disabled={false}
    fieldRequired={false}
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
