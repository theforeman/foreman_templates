import React from 'react';
import { Tooltip, Icon, OverlayTrigger } from 'patternfly-react';
import PropTypes from 'prop-types';

const ButtonTooltip = props => {
  const tooltip = (
    <Tooltip id={`${props.tooltipId}-tooltip-id`}>
      <span>Use default value from settings</span>
    </Tooltip>
  );

  return (
    <OverlayTrigger overlay={tooltip} trigger={['hover', 'focus']}>
      <Icon type="fa" name="refresh" />
    </OverlayTrigger>
  );
};

ButtonTooltip.propTypes = {
  tooltipId: PropTypes.string.isRequired,
};

export default ButtonTooltip;
