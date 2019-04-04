import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';

import Pagination from 'foremanReact/components/Pagination/PaginationWrapper';

import SyncedTemplate from './SyncedTemplate';
import { templatesPage } from '../TemplateSyncResultSelectors';
import ListViewHeader from './ListViewHeader';

const SyncResultList = ({ pagination, pageChange, templates, editPaths }) => (
  <ListView>
    <ListViewHeader />
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
);

SyncResultList.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
  pageChange: PropTypes.func,
  templates: PropTypes.array,
  editPaths: PropTypes.object,
};

export default SyncResultList;
