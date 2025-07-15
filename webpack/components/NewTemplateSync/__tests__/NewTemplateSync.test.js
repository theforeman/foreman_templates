import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NewTemplateSync } from '../index';
import { TemplateSyncContext } from '../../TemplateSyncContext';
import { mockContextValues } from './testData';

jest.mock('foremanReact/routes/common/PageLayout/PageLayout', () =>
  jest.fn(props => (
    <div>
      {props.header && <h1>{props.header}</h1>}
      {props.toolbarButtons && <div>{props.toolbarButtons}</div>}
      {props.children}
    </div>
  ))
);

describe('NewTemplateSync', () => {
  const setup = (values = mockContextValues) =>
    render(
      <MemoryRouter>
        <TemplateSyncContext.Provider value={values}>
          <NewTemplateSync />
        </TemplateSyncContext.Provider>
      </MemoryRouter>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders PageLayout with correct header and searchable props', () => {
    setup();

    expect(screen.getByText('Import or Export Templates')).toBeInTheDocument();
  });

  it('renders NewTemplateSyncForm when not loading', () => {
    setup();

    expect(screen.getByLabelText('Import')).toBeInTheDocument();
    expect(screen.getByLabelText('Export')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('does not render NewTemplateSyncForm when loading', () => {
    const loadingContext = {
      ...mockContextValues,
      isLoading: true,
    };

    setup(loadingContext);

    expect(screen.queryByLabelText('Import')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Export')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /submit/i })
    ).not.toBeInTheDocument();
  });

  it('renders header text even when loading', () => {
    const loadingContext = {
      ...mockContextValues,
      isLoading: true,
    };

    setup(loadingContext);

    expect(screen.getByText('Import or Export Templates')).toBeInTheDocument();
  });

  it('uses context isLoading value correctly', () => {
    const loadingContext = {
      ...mockContextValues,
      isLoading: true,
    };

    setup(loadingContext);

    expect(screen.queryByLabelText('Import')).not.toBeInTheDocument();

    const notLoadingContext = {
      ...mockContextValues,
      isLoading: false,
    };

    setup(notLoadingContext);

    expect(screen.getByLabelText('Import')).toBeInTheDocument();
  });

  it('handles undefined context values gracefully', () => {
    const undefinedContext = {
      ...mockContextValues,
      isLoading: undefined,
    };

    setup(undefinedContext);

    expect(screen.getByLabelText('Import')).toBeInTheDocument();
  });

  it('handles null context values gracefully', () => {
    const nullContext = {
      ...mockContextValues,
      isLoading: null,
    };

    setup(nullContext);

    expect(screen.getByLabelText('Import')).toBeInTheDocument();
  });

  it('handles false context values correctly', () => {
    const falseContext = {
      ...mockContextValues,
      isLoading: false,
    };

    setup(falseContext);

    expect(screen.getByLabelText('Import')).toBeInTheDocument();
  });

  it('maintains consistent header text across loading states', () => {
    const loadingContext = {
      ...mockContextValues,
      isLoading: true,
    };

    setup(loadingContext);
    expect(screen.getByText('Import or Export Templates')).toBeInTheDocument();

    const notLoadingContext = {
      ...mockContextValues,
      isLoading: false,
    };
    setup(notLoadingContext);

    expect(screen.getAllByText('Import or Export Templates')).toHaveLength(2);
  });
});
