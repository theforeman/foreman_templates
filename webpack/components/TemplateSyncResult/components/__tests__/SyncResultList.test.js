import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SyncResultList from '../SyncResultList';
import {
  mockContextValues,
  mockTemplateSyncImport,
} from '../../../NewTemplateSync/__tests__/testData';

describe('SyncResultList', () => {
  const setup = (
    templates = mockTemplateSyncImport.templates,
    editPaths = mockContextValues.apiResponse.editPaths
  ) => render(<SyncResultList templates={templates} editPaths={editPaths} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all templates in the list', () => {
    setup();

    expect(
      screen.getByText('Ansible Roles - Ansible Default')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Ansible Roles - Install from Galaxy')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Ansible Roles - Install from git')
    ).toBeInTheDocument();

    expect(screen.getByText('Capsule Upgrade Playbook')).toBeInTheDocument();
  });

  it('renders DataList with correct ID', () => {
    setup();

    const dataList = screen.getByRole('grid');
    expect(dataList).toHaveAttribute('id', 'foreman-templates');
  });

  it('renders templates with correct group', () => {
    setup();

    const listItems = screen.getAllByRole('rowgroup');
    expect(listItems).toHaveLength(5);
  });

  it('passes correct props to SyncedTemplate components', () => {
    setup();

    expect(
      screen.getByText('Ansible Roles - Ansible Default')
    ).toBeInTheDocument();
    expect(
      screen.getByText('ansible_roles_-_ansible_default.erb')
    ).toBeInTheDocument();
  });

  it('handles empty templates array', () => {
    setup([]);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('handles single template', () => {
    const singleTemplate = [mockTemplateSyncImport.templates[0]];
    setup(singleTemplate);

    // Should render single template
    expect(
      screen.getByText('Ansible Roles - Ansible Default')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Ansible Roles - Install from Galaxy')
    ).not.toBeInTheDocument();
  });
});
