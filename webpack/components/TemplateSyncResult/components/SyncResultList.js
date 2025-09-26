import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataList } from '@patternfly/react-core';

import Pagination from 'foremanReact/components/Pagination';
import SyncedTemplate from './SyncedTemplate';

const SyncResultList = ({ templates, editPaths }) => {
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);

  const onPaginationChange = ({ page: newPage, per_page: newPerPage }) => {
    setPage(newPage);
    setPerPage(newPerPage);
  };

  const templatesPage = templates.slice(
    (page - 1) * perPage,
    (page - 1) * perPage + perPage
  );

  return (
    <DataList id="foreman-templates">
      {templatesPage.length > 0 &&
        templatesPage.map((template, index) => (
          <SyncedTemplate
            template={template}
            key={`sync-template-${index}`}
            editPath={editPaths}
          />
        ))}
      <Pagination
        itemCount={templates.length}
        onChange={onPaginationChange}
        page={page}
        perPage={perPage}
        updateParamsByUrl={false}
      />
    </DataList>
  );
};

SyncResultList.propTypes = {
  templates: PropTypes.array.isRequired,
  editPaths: PropTypes.object.isRequired,
};

export default SyncResultList;
