import React from 'react';
import { ListView } from 'patternfly-react';
import { Tooltip } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const InfoItem = ({ itemId, children, tooltipText }) => {
  const overlay = (
    <Tooltip content={tooltipText || ''} id={itemId}>
      {children}
    </Tooltip>
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
