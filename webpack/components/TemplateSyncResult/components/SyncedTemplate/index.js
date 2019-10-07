import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';

import {
  expandableContent,
  itemLeftContentIcon,
  additionalInfo,
} from './helpers';

const SyncedTemplate = ({ template, editPath }) => (
  <ListView.Item
    key={template.id}
    additionalInfo={additionalInfo(template, editPath)}
    className="listViewItem--listItemVariants"
    leftContent={itemLeftContentIcon(template)}
    hideCloseIcon
    stacked
  >
    {expandableContent(template)}
  </ListView.Item>
);

SyncedTemplate.propTypes = {
  template: PropTypes.object.isRequired,
  editPath: PropTypes.string,
};

SyncedTemplate.defaultProps = {
  editPath: '',
};

export default SyncedTemplate;
