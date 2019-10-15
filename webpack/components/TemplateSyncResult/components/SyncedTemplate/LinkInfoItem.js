import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';

import { itemIteratorId } from './helpers';

const wrapWithLink = (template, editPath) => {
  if (template.id && template.canEdit) {
    return (
      <a
        href={editPath.replace(':id', template.id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {template.name}
      </a>
    );
  }
  return template.name || ' ';
};

const LinkInfoItem = ({ template, editPath, attr }) => (
  <ListView.InfoItem
    key={itemIteratorId(template, attr)}
    className="additional-info-wide"
  >
    {wrapWithLink(template, editPath)}
  </ListView.InfoItem>
);

LinkInfoItem.propTypes = {
  template: PropTypes.object.isRequired,
  editPath: PropTypes.string.isRequired,
  attr: PropTypes.string.isRequired,
};

export default LinkInfoItem;
