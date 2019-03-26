import React from 'react';
import { ListView } from 'patternfly-react';
import Pagination from 'foremanReact/components/Pagination/PaginationWrapper';

import SyncedTemplate from './SyncedTemplate';
import { templatesPage } from '../TemplateSyncResultSelectors';

const SyncResultList = props => {
  const { pagination, pageChange, templates, editPaths } = props;

  return (
    <ListView>
      {
        templatesPage(templates, pagination).map((template) => (
          <SyncedTemplate
            template={template}
            key={template.name}
            editPath={editPaths[template.className]}
          />
        ))
      }
      <Pagination
        viewType='list'
        itemCount={templates.length}
        pagination={pagination}
        onChange={pageChange}
        dropdownButtonId='template-sync-result-dropdown'
      />
    </ListView>
  )
};

export default SyncResultList;
