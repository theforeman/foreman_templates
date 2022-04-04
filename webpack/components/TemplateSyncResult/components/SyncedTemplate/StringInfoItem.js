import React from 'react';
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import InfoItem from './InfoItem';
import { itemIteratorId } from './helpers';

const StringInfoItem = ({
  template,
  attr,
  tooltipText,
  translate,
  mapAttr,
  elipsed,
}) => {
  const inner = (
    <span>
      {translate ? __(mapAttr(template, attr)) : mapAttr(template, attr)}
    </span>
  );
  const innerContent = elipsed ? (
    <EllipsisWithTooltip placement="top">{inner}</EllipsisWithTooltip>
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
  translate: PropTypes.bool,
  mapAttr: PropTypes.func,
  elipsed: PropTypes.bool,
};

StringInfoItem.defaultProps = {
  translate: false,
  mapAttr: (template, attr) => template[attr],
  elipsed: false,
  tooltipText: undefined,
};

export default StringInfoItem;
