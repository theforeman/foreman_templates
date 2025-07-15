import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Thead, Tr, Th } from '@patternfly/react-table';

import { translate as __ } from 'foremanReact/common/I18n';

import Pagination from 'foremanReact/components/Pagination';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import SyncedTemplate from './SyncedTemplate';

const TemplatesTableHead = () => (
  <>
    <Thead>
      <Tr ouiaId="table-header">
        <Th aria-label="Toggle button" width={3} />
        <Th aria-label="State Icon" width={3} />
        <Th width={25}>{__('Name')}</Th>
        <Th width={2} modifier="wrap">
          {__('Locked')}
        </Th>
        <Th width={2} modifier="wrap">
          {__('Snippet')}
        </Th>
        <Th width={25}>{__('Template Class')}</Th>
        <Th width={10}>{__('Kind')}</Th>
        <Th width={30}>{__('File Name')}</Th>
      </Tr>
    </Thead>
  </>
);

const SyncResultList = ({ templates, editPaths }) => {
  const { settingsPerPage = 20 } = useForemanSettings() || {};
  const [perPage, setPerPage] = useState(settingsPerPage);
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
    <>
      <Table
        aria-label="Templates table"
        id="foreman-templates"
        ouiaId="foreman-templates"
      >
        <TemplatesTableHead />
        {templatesPage.length > 0 &&
          templatesPage.map((template, index) => (
            <SyncedTemplate
              template={template}
              key={`sync-template-${index}`}
              editPath={editPaths}
            />
          ))}
      </Table>
      <Pagination
        itemCount={templates.length}
        onChange={onPaginationChange}
        page={page}
        perPage={perPage}
        updateParamsByUrl={false}
      />
    </>
  );
};

SyncResultList.propTypes = {
  templates: PropTypes.array.isRequired,
  editPaths: PropTypes.object.isRequired,
};

export default SyncResultList;
