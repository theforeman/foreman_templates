import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';
import SyncedTemplate from '../SyncedTemplate';
import { mockContextValues } from '../../../NewTemplateSync/__tests__/testData';

describe('SyncedTemplate', () => {
  const data = {
    additional_errors: null,
    errors: {},
    name: 'Test Job Template',
    template_file: 'test.erb',
    additional_info: null,
    id: 1,
    snippet: false,
    locked: false,
    kind: null,
    class_name: 'JobTemplate',
    humanized_class_name: 'Job Template',
    can_edit: true,
  };
  const mockTemplate = deepPropsToCamelCase(data);

  const setup = (
    template = mockTemplate,
    editPath = mockContextValues.apiResponse.editPaths
  ) =>
    render(
      <table>
        <SyncedTemplate template={template} editPath={editPath} />
      </table>
    );

  it('renders template with correct structure', () => {
    setup();

    expect(screen.getByRole('rowgroup')).toBeInTheDocument();
    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
    expect(screen.getByText('test.erb')).toBeInTheDocument();
    expect(screen.getByText('Job Template')).toBeInTheDocument();
  });

  it('renders template with locked state', () => {
    const lockedTemplate = { ...mockTemplate, locked: true };
    setup(lockedTemplate);

    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('renders template with snippet state', () => {
    const snippetTemplate = { ...mockTemplate, snippet: true };
    setup(snippetTemplate);

    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('renders template with additional info', () => {
    const infoTemplate = {
      ...mockTemplate,
      additionalInfo: 'Some additional info',
    };
    setup(infoTemplate);

    // Should render additional info
    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('renders template with errors', () => {
    const errorTemplate = { ...mockTemplate, errors: { name: ['Name error'] } };
    setup(errorTemplate);

    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('renders template with additional errors', () => {
    const additionalErrorTemplate = {
      ...mockTemplate,
      additionalErrors: 'Additional error message',
    };
    setup(additionalErrorTemplate);

    // Should render additional errors
    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('renders template name as text when not editable', () => {
    const nonEditableTemplate = { ...mockTemplate, canEdit: false };
    setup(nonEditableTemplate);

    const nameText = screen.getByText('Test Job Template');
    expect(nameText.tagName).toBe('SPAN');
  });

  it('renders template name as text when no id', () => {
    const noIdTemplate = { ...mockTemplate, id: null };
    setup(noIdTemplate);

    const nameText = screen.getByText('Test Job Template');
    expect(nameText.tagName).toBe('SPAN');
  });

  it('handles missing template attributes gracefully', () => {
    const incompleteTemplate = {
      id: 1,
      name: 'Test Template',
      templateFile: 'test.erb',
    };
    setup(incompleteTemplate);

    // Should still render with available attributes
    expect(screen.getByText('Test Template')).toBeInTheDocument();
    expect(screen.getByText('test.erb')).toBeInTheDocument();
  });

  it('expands and collapses when row is clicked', async () => {
    const { container } = setup();

    const listItem = screen.getByRole('button');
    const row = listItem.firstElementChild;
    await userEvent.click(row);

    const section = container.querySelector('tr.pf-v5-c-table__expandable-row');
    expect(section).not.toHaveAttribute('hidden');

    await userEvent.click(row);
    expect(section).toHaveAttribute('hidden');
  });

  it('renders different template types correctly', () => {
    const provisioningTemplate = {
      ...mockTemplate,
      className: 'ProvisioningTemplate',
      humanizedClassName: 'Provisioning Template',
    };
    setup(provisioningTemplate);

    expect(screen.getByText('Provisioning Template')).toBeInTheDocument();
  });

  it('renders Ptable template with mapped name', () => {
    const ptableTemplate = {
      ...mockTemplate,
      className: 'Ptable',
      humanizedClassName: 'Ptable',
    };
    setup(ptableTemplate);

    expect(screen.getByText('Partition Table')).toBeInTheDocument();
  });

  it('renders template with different error configurations', () => {
    const complexErrorTemplate = {
      ...mockTemplate,
      errors: {
        base: ['Base error'],
        name: ['Name error'],
        description: ['Description error'],
      },
      additionalInfo: 'Some additional info',
    };
    setup(complexErrorTemplate);

    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
    expect(screen.getByText('Base error')).toBeInTheDocument();
    expect(screen.getByText(/Description error/i)).toBeInTheDocument();
    expect(screen.getByText(/Name error/i)).toBeInTheDocument();
  });

  it('renders template without errors', () => {
    setup();

    const toggle = screen.getByRole('button', { name: /Details/i });
    fireEvent.click(toggle);

    expect(screen.getByText('There were no errors.')).toBeInTheDocument();
  });

  it('handles template with only additionalInfo', () => {
    const infoOnlyTemplate = {
      ...mockTemplate,
      errors: {},
      additionalInfo: 'Just some info',
    };
    setup(infoOnlyTemplate);

    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('handles template with only errors', () => {
    const errorsOnlyTemplate = {
      ...mockTemplate,
      errors: { name: ['Name error'] },
      additionalInfo: null,
    };
    setup(errorsOnlyTemplate);

    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('renders with minimal template data', () => {
    const minimalTemplate = {
      id: 1,
      name: 'Minimal Template',
      templateFile: 'minimal.erb',
    };
    setup(minimalTemplate);

    expect(screen.getByText('Minimal Template')).toBeInTheDocument();
    expect(screen.getByText('minimal.erb')).toBeInTheDocument();
  });

  it('handles different edit path configurations', () => {
    const customEditPath = {
      JobTemplate: '/custom/job_templates/:id/edit',
    };
    setup(mockTemplate, customEditPath);

    const nameLink = screen.getByText('Test Job Template');
    expect(nameLink).toHaveAttribute('href', '/custom/job_templates/1/edit');
  });

  it('handles missing edit paths gracefully', () => {
    const emptyEditPath = {};
    setup(mockTemplate, emptyEditPath);

    const nameText = screen.getByText('Test Job Template');
    expect(nameText.tagName).toBe('A');
  });

  it('handles template with all boolean flags set to true', () => {
    const allTrueTemplate = {
      ...mockTemplate,
      locked: true,
      snippet: true,
      canEdit: true,
    };
    setup(allTrueTemplate);

    expect(screen.queryByLabelText('snippet')).toBeInTheDocument();
    expect(screen.queryByLabelText('locked')).toBeInTheDocument();
    expect(screen.queryByLabelText('can-edit')).toBeInTheDocument();
    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });

  it('handles template with all boolean flags set to false', () => {
    const allFalseTemplate = {
      ...mockTemplate,
      locked: false,
      snippet: false,
      canEdit: false,
    };
    setup(allFalseTemplate);

    expect(screen.queryByLabelText('snippet')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('locked')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('can-edit')).not.toBeInTheDocument();
    expect(screen.getByText('Test Job Template')).toBeInTheDocument();
  });
});
