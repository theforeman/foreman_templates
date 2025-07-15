import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListToggle,
  DataListContent,
  DataListItemCells,
} from '@patternfly/react-core';

import {
  expandableContent,
  itemLeftContentIcon,
  additionalInfo,
} from './helpers';

const SyncedTemplate = ({ template, editPath }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <DataListItem key={template.id} isExpanded={isExpanded}>
      <DataListItemRow
        className="listViewItem"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <DataListToggle
          onClick={() => setIsExpanded(!isExpanded)}
          isExpanded={false}
          id={template.id}
          aria-controls={template.id}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell isIcon key={`1-cell-${template.id}`}>
              {itemLeftContentIcon(template)}
            </DataListCell>,
            <DataListCell
              width={5}
              key={`2-cell-${template.id}`}
              className="sync-result-datalist-cell"
            >
              {additionalInfo(template, editPath)}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent isHidden={!isExpanded}>
        {expandableContent(template)}
      </DataListContent>
    </DataListItem>
  );
};

SyncedTemplate.propTypes = {
  template: PropTypes.object.isRequired,
  editPath: PropTypes.object.isRequired,
};

export default SyncedTemplate;
