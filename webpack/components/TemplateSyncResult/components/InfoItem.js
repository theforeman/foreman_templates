import React from 'react';
import { ListView, OverlayTrigger, Tooltip } from 'patternfly-react';

const InfoItem = ({ itemId, children, tooltipText }) => {
  const overlay = (
    <OverlayTrigger overlay={tooltipText ? (<Tooltip id={itemId}>{ tooltipText }</Tooltip>) : ''}
                    placement="top"
                    trigger={['hover', 'focus']}
                    rootClose={false}
                    >
        { children }
      </OverlayTrigger>
    )
  return (
    <ListView.InfoItem key={itemId} className='additional-info-wide'>
      { tooltipText ? overlay : children }
    </ListView.InfoItem>
  );
}

export default InfoItem;
