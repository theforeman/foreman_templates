import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom/extend-expect';
import NewTemplateSyncForm from '../NewTemplateSyncForm';
import { APIActions } from '../../../../../__mocks__/foremanReact/redux/API';
import {
  SYNC_RESULT_URL,
  SYNC_SETTINGS_FORM_SUBMIT,
} from '../../../../../consts';
import { mockContextValues } from '../../../__tests__/testData';

const mockStore = configureMockStore([thunk]);

const store = mockStore({ ...mockStore });

jest.spyOn(APIActions, 'post').mockImplementation(args => {
  // eslint-disable-next-line no-unused-expressions
  args.handleSuccess?.({ data: { templates: [] } });
  return { type: 'DUMMY' };
});

const setView = jest.fn();

describe('NewTemplateSyncForm', () => {
  const setup = (values = mockContextValues) =>
    render(
      <Provider store={store}>
        <NewTemplateSyncForm
          apiResponse={values.apiResponse}
          isTemplatesLoading={values.isTemplatesLoading}
          setIsTemplatesLoading={values.setIsTemplatesLoading}
          setReceivedTemplates={values.setReceivedTemplates}
          setView={setView}
        />
      </Provider>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with radio buttons and submit button', () => {
    setup();

    expect(screen.getByLabelText('Import')).toBeInTheDocument();
    expect(screen.getByLabelText('Export')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders form with correct radio buttons based on user permissions', () => {
    const values = {
      ...mockContextValues,
      apiResponse: {
        ...mockContextValues.apiResponse,
        userPermissions: {
          ...mockContextValues.apiResponse.userPermissions,
          import: true,
          export: false,
        },
      },
    };

    setup(values);

    expect(screen.getByLabelText('Import')).toBeInTheDocument();
    expect(screen.getByLabelText('Import')).toBeChecked();
    expect(screen.queryByText(/Export/i)).not.toBeInTheDocument();
  });

  it('updates sync type when a radio button is clicked', () => {
    setup();

    fireEvent.click(screen.getByLabelText('Export'));
    expect(screen.getByLabelText('Export')).toBeChecked();
  });

  it('displays loading state when submitting the form', async () => {
    const values = {
      ...mockContextValues,
      isTemplatesLoading: true,
    };
    setup(values);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('submits the form with correct parameters', async () => {
    setup();

    fireEvent.click(screen.getByText('Submit'));

    expect(APIActions.post).toHaveBeenCalledWith({
      key: SYNC_SETTINGS_FORM_SUBMIT,
      url: '/ui_template_syncs/import',
      params: {
        associate: 'new',
        negate: false,
        repo: 'https://github.com/theforeman/community-templates.git',
      },
      handleSuccess: expect.any(Function),
      handleError: expect.any(Function),
      successToast: expect.any(Function),
      errorToast: expect.any(Function),
    });
  });

  it('navigates to result page on successful form submission', async () => {
    setup();
    await fireEvent.click(screen.getByText('Submit'));

    expect(setView).toHaveBeenCalledWith(SYNC_RESULT_URL);
  });
});
