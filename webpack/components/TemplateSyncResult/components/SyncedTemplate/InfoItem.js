import React from 'react';
import { ListView, OverlayTrigger, Tooltip } from 'patternfly-react';
import PropTypes from 'prop-types';

const InfoItem = ({ itemId, children, tooltipText }) => {
  const overlay = (
    <OverlayTrigger
      overlay={tooltipText ? <Tooltip id={itemId}>{tooltipText}</Tooltip> : ''}
      placement="top"
      trigger={['hover', 'focus']}
      rootClose={false}
    >
      {children}
    </OverlayTrigger>
  );
  return (
    <ListView.InfoItem key={itemId} className="additional-info-wide">
      {tooltipText ? overlay : children}
    </ListView.InfoItem>
  );
};

InfoItem.propTypes = {
  itemId: PropTypes.string.isRequired,
  children: PropTypes.node,
  tooltipText: PropTypes.string,
};

InfoItem.defaultProps = {
  tooltipText: '',
  children: undefined,
};

export default InfoItem;
