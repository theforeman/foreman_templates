import React from 'react';
import { Icon } from 'patternfly-react';
import PropTypes from 'prop-types';

import InfoItem from './InfoItem';
import { itemIteratorId } from './helpers';

const IconInfoItem = ({ template, attr, iconName, tooltipText }) => (
  <InfoItem itemId={itemIteratorId(template, attr)} tooltipText={tooltipText}>
    <Icon type="fa" name={iconName} />
  </InfoItem>
);

IconInfoItem.propTypes = {
  template: PropTypes.object.isRequired,
  attr: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  tooltipText: PropTypes.string.isRequired,
};

export default IconInfoItem;
