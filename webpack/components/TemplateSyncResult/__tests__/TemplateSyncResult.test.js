import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TemplateSyncResult from '../TemplateSyncResult';
import {
  mockContextValues,
  mockTemplateSyncImport,
} from '../../NewTemplateSync/__tests__/testData';
import { SYNC_BASE_URL } from '../../../consts';

const setView = jest.fn();

describe('TemplateSyncResult', () => {
  const fullValues = {
    ...mockContextValues,
    receivedTemplates: { ...mockTemplateSyncImport },
  };

  const setup = (contextValues = fullValues) =>
    render(
      <TemplateSyncResult
        apiResponse={contextValues.apiResponse}
        isTemplatesLoading={contextValues.isTemplatesLoading}
        receivedTemplates={contextValues.receivedTemplates}
        setView={setView}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when templates are loading', () => {
    const loadingContext = {
      ...mockContextValues,
      isTemplatesLoading: true,
    };

    setup(loadingContext);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('renders EmptySyncResult when no templates received', () => {
    const noTemplatesContext = {
      ...mockContextValues,
    };

    setup(noTemplatesContext);

    expect(
      screen.getByRole('heading', { name: 'No Template Sync Result' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'To view results of a template sync, you must import/export the templates first.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sync Templates' })
    ).toBeInTheDocument();
  });

  it('renders EmptySyncResult when templates array is empty', () => {
    const emptyTemplatesContext = {
      ...mockContextValues,
      receivedTemplates: {
        ...mockTemplateSyncImport,
        templates: [],
      },
    };

    setup(emptyTemplatesContext);

    expect(
      screen.getByRole('heading', { name: 'No Template Sync Result' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sync Templates' })
    ).toBeInTheDocument();
  });

  it('renders EmptySyncResult when templates array is null', () => {
    const nullTemplatesContext = {
      ...mockContextValues,
      receivedTemplates: {
        ...mockTemplateSyncImport,
        templates: null,
      },
    };

    setup(nullTemplatesContext);

    expect(
      screen.getByRole('heading', { name: 'No Template Sync Result' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sync Templates' })
    ).toBeInTheDocument();
  });

  it('renders FinishedSyncResult when templates are available', () => {
    setup();

    expect(
      screen.getByText('Ansible Roles - Ansible Default')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to sync form' })
    ).toBeInTheDocument();
  });

  it('calls redirectBack when Sync Templates button is clicked', () => {
    const noTemplatesContext = {
      ...mockContextValues,
      receivedTemplates: {},
    };

    setup(noTemplatesContext);

    fireEvent.click(screen.getByRole('button', { name: 'Sync Templates' }));

    expect(setView).toHaveBeenCalledWith(SYNC_BASE_URL);
  });

  it('calls redirectBack when Back to sync form button is clicked', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Back to sync form' }));

    expect(setView).toHaveBeenCalledWith(SYNC_BASE_URL);
  });

  it('prioritizes loading state over other conditions', () => {
    const loadingWithTemplatesContext = {
      ...mockContextValues,
      isTemplatesLoading: true,
      receivedTemplates: mockTemplateSyncImport,
    };

    setup(loadingWithTemplatesContext);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    expect(screen.queryByText('Import from')).not.toBeInTheDocument();
  });
});
