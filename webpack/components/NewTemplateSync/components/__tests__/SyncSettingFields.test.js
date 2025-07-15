import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SyncSettingsFields from '../SyncSettingFields';
import { mockContextValues } from '../../__tests__/testData';

describe('SyncSettingsFields', () => {
  const mockHandleChange = jest.fn();
  const mockSetValidated = jest.fn();
  const mockValidated = 'success';

  const mockSettings = [
    {
      id: 'template_sync_repo',
      value: 'https://github.com/test/repo.git',
      description:
        'Target path to import/export. Different protocols can be used.',
      fullName: 'Repository',
      name: 'repo',
      selection: [],
    },
    {
      id: 'template_sync_branch',
      value: 'main',
      description: 'Default branch in Git repo',
      fullName: 'Branch',
      name: 'branch',
      selection: [],
    },
    {
      id: 'template_sync_http_proxy_policy',
      value: 'selected',
      description: 'HTTP proxy policy for template sync',
      fullName: 'HTTP Proxy Policy',
      name: 'http_proxy_policy',
      selection: [
        { value: 'global', label: 'Global' },
        { value: 'selected', label: 'Selected' },
        { value: 'none', label: 'None' },
      ],
    },
    {
      id: 'template_sync_http_proxy_id',
      value: '1',
      description: 'HTTP proxy ID when policy is selected',
      fullName: 'HTTP Proxy ID',
      name: 'http_proxy_id',
      selection: [],
    },
  ];

  const mockOriginal = [
    { value: 'https://github.com/original/repo.git' },
    { value: 'master' },
    { value: 'global' },
    { value: '2' },
  ];

  const defaultProps = {
    syncType: 'import',
    handleChange: mockHandleChange,
    values: mockSettings,
    original: mockOriginal,
    formProps: { isSubmitting: false },
    setValidated: mockSetValidated,
    validated: mockValidated,
  };

  const setup = (props = defaultProps, values = mockContextValues) =>
    render(
      <SyncSettingsFields
        apiResponse={values.apiResponse}
        isTemplatesLoading={values.isTemplatesLoading}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all settings when proxy policy is not selected', () => {
    const props = {
      ...defaultProps,
      values: mockSettings.map(setting =>
        setting.id === 'template_sync_http_proxy_policy'
          ? { ...setting, value: 'global' }
          : setting
      ),
    };
    setup(props);

    expect(document.querySelectorAll('.pf-v5-c-form__group')).toHaveLength(3);
    expect(screen.queryByText(/Repository/i)).toBeInTheDocument();
    expect(screen.queryByText(/Branch/i)).toBeInTheDocument();
    expect(screen.queryByText(/HTTP Proxy Policy/i)).toBeInTheDocument();
    expect(screen.queryByText(/HTTP Proxy ID/i)).not.toBeInTheDocument();
  });

  test('renders http_proxy_id setting when proxy policy is selected', () => {
    setup();

    expect(document.querySelectorAll('.pf-v5-c-form__group')).toHaveLength(4);
    expect(screen.queryByText(/Repository/i)).toBeInTheDocument();
    expect(screen.queryByText(/Branch/i)).toBeInTheDocument();
    expect(screen.queryByText(/HTTP Proxy Policy/i)).toBeInTheDocument();
    expect(screen.queryByText(/HTTP Proxy ID/i)).toBeInTheDocument();
  });

  test('renders form groups with correct labels and help icons', () => {
    setup();

    const formGroups = document.querySelectorAll(
      'label[class="pf-v5-c-form__label"]'
    );

    formGroups.forEach((formGroup, index) => {
      const setting = mockSettings[index];
      expect(formGroup).toHaveTextContent(setting.fullName);
    });
  });

  test('handles settings without descriptions gracefully', () => {
    const settingsWithoutDescription = mockSettings.map(setting => ({
      ...setting,
      description: undefined,
    }));

    const props = { ...defaultProps, values: settingsWithoutDescription };

    setup(props);

    expect(
      document.querySelectorAll('label[class="pf-v5-c-form__label"]')
    ).toHaveLength(4);
  });

  test('handles empty values array', () => {
    const props = { ...defaultProps, values: [] };
    setup(props);

    expect(screen.queryByTestId('form-group')).not.toBeInTheDocument();
  });
});
