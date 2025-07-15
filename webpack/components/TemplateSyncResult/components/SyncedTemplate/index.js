import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tbody, Tr, Td } from '@patternfly/react-table';

import {
  expandableContent,
  itemLeftContentIcon,
  additionalInfo,
} from './helpers';

const SyncedTemplate = ({ template, editPath }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Tbody key={template.id} isExpanded={isExpanded}>
      <Tr
        ouiaId={`table-row-${template.id}`}
        className="listViewItem"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Td
          expand={{
            isExpanded,
            onToggle: () => setIsExpanded(!isExpanded),
            rowIndex: template.id,
          }}
          id={template.id}
          aria-controls={template.id}
        />
        <Td key={template.id}> {itemLeftContentIcon(template)}</Td>
        {additionalInfo(template, editPath)}
      </Tr>
      <Tr ouiaId={`table-row-${template.id}-expanded`} isExpanded={isExpanded}>
        <Td colSpan={7}>{expandableContent(template)}</Td>
      </Tr>
    </Tbody>
  );
};

SyncedTemplate.propTypes = {
  template: PropTypes.object.isRequired,
  editPath: PropTypes.object.isRequired,
};

export default SyncedTemplate;
