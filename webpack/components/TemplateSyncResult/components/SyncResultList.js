import React from 'react';
import { ListView } from 'patternfly-react';
import Pagination from 'foremanReact/components/Pagination/PaginationWrapper';

import SyncedTemplate from './SyncedTemplate';
import { templatesPage } from '../TemplateSyncResultSelectors';

const SyncResultList = props => {
  const { pagination, pageChange, templates, editPaths } = props;

  return (
    <ListView>
      <Pagination
        viewType='list'
        itemCount={templates.length}
        pagination={pagination}
        onChange={pageChange}
        dropdownButtonId='template-sync-result-dropdown'
      />
      {
        templatesPage(templates, pagination).map((template) => (
          <SyncedTemplate
            template={template}
            key={template.name}
            editPath={editPaths[template.className]}
          />
        ))
      }
    </ListView>
  )
};

export default SyncResultList;
