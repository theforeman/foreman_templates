import React from 'react';
import { ListView, Icon } from 'patternfly-react';
import classNames from 'classnames';

import InfoItem from './SyncedTemplate/InfoItem';

const ListViewHeader = props => {
  const additionalInfo = [
    'Name',
    'Locked',
    'Snippet',
    'Template Class',
    'Kind',
    'File Name',
  ].map((title, idx) => (
    <InfoItem itemId={`${idx}`} key={idx}>
      <strong>{title}</strong>
    </InfoItem>
  ));

  // Use ListView.Item as a header to get a vertical alignment
  return (
    <ListView.Item
      additionalInfo={additionalInfo}
      className={classNames(
        'listViewItem--listItemVariants',
        'list-view-header'
      )}
      leftContent={<Icon name="ok" size="sm" type="pf" />}
      hideCloseIcon
      stacked
    >
      <span />
    </ListView.Item>
  );
};

export default ListViewHeader;
