import React from 'react';
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';
import InfoItem from './InfoItem';

const StringInfoItem = ({
  template,
  attr,
  tooltipText,
  translate = false,
  mapAttr = (template, attr) => template[attr],
  elipsed = false
}) => {
    const inner = <span>{ translate ? __(mapAttr(template, attr)) : mapAttr(template, attr) }</span>
    const innerContent = elipsed ? (
            <EllipsisWithTooltip placement="top">
              { inner }
            </EllipsisWithTooltip>) :
            inner

    return (<InfoItem itemId={itemIteratorId(template, attr)}
                      tooltipText={tooltipText}>
              { innerContent }
            </InfoItem>);
};

export const itemIteratorId = (template, attr) =>
  `${template.name}-${attr}`;

export default StringInfoItem;
