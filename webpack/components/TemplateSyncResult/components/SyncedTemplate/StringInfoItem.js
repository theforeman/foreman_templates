import React from 'react';
import { Truncate } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import InfoItem from './InfoItem';
import { itemIteratorId } from './helpers';

const StringInfoItem = ({ template, attr, tooltipText, mapAttr, elipsed }) => {
  const inner = <span>{mapAttr(template, attr)}</span>;
  const innerContent = elipsed ? (
    <Truncate content={inner} tooltipPosition="top" />
  ) : (
    inner
  );

  return (
    <InfoItem itemId={itemIteratorId(template, attr)} tooltipText={tooltipText}>
      {innerContent}
    </InfoItem>
  );
};

StringInfoItem.propTypes = {
  template: PropTypes.object.isRequired,
  attr: PropTypes.string.isRequired,
  tooltipText: PropTypes.string,
  mapAttr: PropTypes.func,
  elipsed: PropTypes.bool,
};

StringInfoItem.defaultProps = {
  mapAttr: (template, attr) => template[attr],
  elipsed: false,
  tooltipText: undefined,
};

export default StringInfoItem;
