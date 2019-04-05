import React from 'react';
import { ListView, Icon } from 'patternfly-react';
import classNames from 'classnames';

import InfoItem from './InfoItem';

const ListViewHeader = props => {
  const additionalInfo = ['Locked', 'Snippet', 'Template Class', 'Kind', 'File Name'].map((title, idx) => {
    return (
      <InfoItem itemId={`${idx}`} key={idx}>
        <strong>{ title }</strong>
      </InfoItem>
    );
  });

  // Use ListView.Item as a header to get a vertical alignment
  return (
    <ListView.Item
      heading='Name'
      additionalInfo={additionalInfo}
      className={classNames('listViewItem--listItemVariants', 'list-view-header')}
      leftContent={<Icon name='ok' size="sm" type='pf' />}
      hideCloseIcon
      stacked
    >
    <span></span>
    </ListView.Item>
  )
}

export default ListViewHeader;
