import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';

import { templateErrors, itemLeftContentIcon, additionalInfo } from './helpers';

const SyncedTemplate = ({ template, editPath }) => (
  <ListView.Item
    key={template.id}
    additionalInfo={additionalInfo(template, editPath)}
    className="listViewItem--listItemVariants"
    leftContent={itemLeftContentIcon(template)}
    hideCloseIcon
    stacked
  >
    {templateErrors(template)}
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
