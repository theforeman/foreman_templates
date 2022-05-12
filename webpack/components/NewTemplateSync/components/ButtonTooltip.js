import React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { RedoIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

const ButtonTooltip = ({ tooltipId }) => (
  <Tooltip id={tooltipId} content={__('Use default value from settings')}>
    <RedoIcon />
  </Tooltip>
);

ButtonTooltip.propTypes = {
  tooltipId: PropTypes.string.isRequired,
};

export default ButtonTooltip;
