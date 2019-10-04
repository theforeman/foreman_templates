import React from 'react';
import { ListView } from 'patternfly-react';

import { itemIteratorId } from './helpers';

const LinkInfoItem = ({ template, editPath, attr }) => {
  if (template.id && template.canEdit) {
    return (
      <ListView.InfoItem
        key={itemIteratorId(template, attr)}
        className="additional-info-wide"
      >
        <a
          href={editPath.replace(':id', template.id)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {template.name}
        </a>
      </ListView.InfoItem>
    );
  }
  return template.name || ' ';
};

export default LinkInfoItem;
