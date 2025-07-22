import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';

import Pagination from 'foremanReact/components/Pagination';

import SyncedTemplate from './SyncedTemplate';
import { templatesPage } from '../TemplateSyncResultHelpers';
import ListViewHeader from './ListViewHeader';

const SyncResultList = ({
  pagination,
  pagination: { page, per_page: perPage },
  pageChange,
  templates,
  editPaths,
}) => (
  <ListView>
    <ListViewHeader />
    {templatesPage(templates, pagination).map((template, idx) => (
      <SyncedTemplate
        template={template}
        key={idx}
        editPath={editPaths[template.className]}
      />
    ))}
    <Pagination
      itemCount={templates.length}
      onSetPage={nextPage => pageChange({ page: nextPage, per_page: perPage })}
      onPerPageSelect={nextPerPage =>
        pageChange({ page: 1, per_page: nextPerPage })
      }
      page={page}
      perPage={perPage}
      updateParamsByUrl={false}
    />
  </ListView>
);

SyncResultList.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number,
    per_page: PropTypes.number,
  }).isRequired,
  pageChange: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  editPaths: PropTypes.object.isRequired,
};

export default SyncResultList;
