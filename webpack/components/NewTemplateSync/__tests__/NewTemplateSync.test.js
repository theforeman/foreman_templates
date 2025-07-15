import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom/extend-expect';
import { NewTemplateSync } from '../index';
import { mockContextValues } from './testData';

const mockStore = configureMockStore([thunk]);

const store = mockStore({ ...mockStore });

describe('NewTemplateSync', () => {
  const setup = (values = mockContextValues) =>
    render(
      <Provider store={store}>
        <NewTemplateSync apiResponse={values.apiResponse} />
      </Provider>
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

  it('renders header text even when loading', () => {
    const loadingContext = {
      ...mockContextValues,
      isLoading: true,
    };

    setup(loadingContext);

    expect(screen.getByText('Import or Export Templates')).toBeInTheDocument();
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
