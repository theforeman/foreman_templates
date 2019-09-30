import React from 'react';
import PropTypes from 'prop-types';

import InfoItem from './InfoItem';
import { itemIteratorId } from './helpers';

const EmptyInfoItem = ({ template, attr }) => (
  <InfoItem itemId={itemIteratorId(template, attr)} />
);

EmptyInfoItem.propTypes = {
  template: PropTypes.object.isRequired,
  attr: PropTypes.string.isRequired,
};

export default EmptyInfoItem;
