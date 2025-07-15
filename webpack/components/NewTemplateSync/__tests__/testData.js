import { deepPropsToCamelCase } from '../../../__mocks__/foremanReact/common/helpers';

export const mockedApiResponse = {
  settings: {
    import: [
      {
        id: 'template_sync_repo',
        value: 'https://github.com/theforeman/community-templates.git',
        description:
          'Target path to import/export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.',
        settings_type: 'string',
        default: 'https://github.com/theforeman/community-templates.git',
        full_name: 'Repo',
        name: 'repo',
        selection: [],
      },
      {
        id: 'template_sync_negate',
        value: false,
        description: 'Negate the filter for import/export',
        settings_type: 'boolean',
        default: false,
        full_name: 'Negate',
        name: 'negate',
        selection: [],
      },
      {
        id: 'template_sync_associate',
        value: 'new',
        description: 'Associate templates to OS, organization and location',
        settings_type: 'string',
        default: 'new',
        full_name: 'Associate',
        name: 'associate',
        selection: [
          {
            value: 'always',
            label: '»Always«',
          },
          {
            value: 'new',
            label: '»New«',
          },
          {
            value: 'never',
            label: '»Never«',
          },
        ],
      },
    ],
    export: [
      {
        id: 'template_sync_repo',
        value: 'https://github.com/theforeman/community-templates.git',
        description:
          'Target path to import/export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.',
        settings_type: 'string',
        default: 'https://github.com/theforeman/community-templates.git',
        full_name: 'Repo',
        name: 'repo',
        selection: [],
      },
      {
        id: 'template_sync_branch',
        value: '',
        description: 'Default branch in Git repo',
        settings_type: 'string',
        default: '',
        full_name: 'Branch',
        name: 'branch',
        selection: [],
      },
      {
        id: 'template_sync_dirname',
        value: '/',
        description:
          'The directory within the Git repo containing the templates',
        settings_type: 'string',
        default: '/',
        full_name: 'Dirname',
        name: 'dirname',
        selection: [],
      },
      {
        id: 'template_sync_filter',
        value: '',
        description:
          'Import/export names matching this regex (case-insensitive; snippets are not filtered)',
        settings_type: 'string',
        default: '',
        full_name: 'Filter',
        name: 'filter',
        selection: [],
      },
      {
        id: 'template_sync_negate',
        value: false,
        description: 'Negate the filter for import/export',
        settings_type: 'boolean',
        default: false,
        full_name: 'Negate',
        name: 'negate',
        selection: [],
      },
      {
        id: 'template_sync_metadata_export_mode',
        value: 'refresh',
        description:
          'Default metadata export mode, refresh re-renders metadata, keep will keep existing metadata, remove exports template without metadata',
        settings_type: 'string',
        default: 'refresh',
        full_name: 'Metadata export mode',
        name: 'metadata_export_mode',
        selection: [
          {
            value: 'refresh',
            label: '»Refresh«',
          },
          {
            value: 'keep',
            label: '»Keep«',
          },
          {
            value: 'remove',
            label: '»Remove«',
          },
        ],
      },
      {
        id: 'template_sync_commit_msg',
        value: 'Templates export made by a Foreman user',
        description: 'Custom commit message for templates export',
        settings_type: 'string',
        default: 'Templates export made by a Foreman user',
        full_name: 'Commit message',
        name: 'commit_msg',
        selection: [],
      },
      {
        id: 'template_sync_http_proxy_policy',
        value: 'global',
        description:
          'Should an HTTP proxy be used for template sync? If you select Custom HTTP proxy, you will be prompted to select one.',
        settings_type: 'string',
        default: 'global',
        full_name: 'HTTP proxy policy',
        name: 'http_proxy_policy',
        selection: [
          {
            value: 'global',
            label: '»Global default HTTP proxy«',
          },
          {
            value: 'none',
            label: '»No HTTP proxy«',
          },
          {
            value: 'selected',
            label: '»Custom HTTP proxy«',
          },
        ],
      },
      {
        id: 'template_sync_http_proxy_id',
        value: 1,
        description:
          'Select an HTTP proxy to use for template sync. You can add HTTP proxies on the Infrastructure > HTTP proxies page.',
        settings_type: 'string',
        default: 1,
        full_name: 'HTTP proxy',
        name: 'http_proxy_id',
        selection: [
          {
            value: 1,
            label: 'test',
          },
        ],
      },
    ],
  },
  apiUrls: {
    exportUrl: '/ui_template_syncs/export',
    syncSettingsUrl: '/ui_template_syncs/sync_settings',
    importUrl: '/ui_template_syncs/import',
  },
  validationData: {
    repo: [
      'http://',
      'https://',
      'git://',
      'ssh://',
      'git+ssh://',
      'ssh+git://',
      '/',
    ],
  },
  editPaths: {
    JobTemplate: '/job_templates/:id/edit',
    ProvisioningTemplate: '/templates/provisioning_templates/:id/edit',
    Ptable: '/templates/ptables/:id/edit',
    ReportTemplate: '/templates/report_templates/:id/edit',
    WebhookTemplate: '/templates/webhook_templates/:id/edit',
  },
  fileRepoStartWith: ['/'],
  userPermissions: {
    import: true,
    export: true,
  },
};

export const mockDispatch = jest.fn();
const { editPaths } = mockedApiResponse;
export const mockContextValues = {
  apiResponse: { ...deepPropsToCamelCase(mockedApiResponse), editPaths },
  dispatch: mockDispatch,
  setReceivedTemplates: jest.fn(),
  setIsTemplatesLoading: jest.fn(),
  isTemplatesLoading: false,
  syncSettingsUrl: '/sync_settings',
  isLoading: false,
  setIsLoading: jest.fn(),
  receivedTemplates: {},
};

const receivedTemplatesData = {
  repo: 'https://github.com/theforeman/community-templates.git',
  branch: 'develop',
  templates: [
    {
      additional_errors: null,
      errors: {
        base: [
          '»This template is locked. Please clone it to a new template to customize.«',
        ],
      },
      name: 'Ansible Roles - Ansible Default',
      template_file: 'ansible_roles_-_ansible_default.erb',
      additional_info: null,
      id: 223,
      snippet: false,
      locked: true,
      kind: null,
      class_name: 'JobTemplate',
      humanized_class_name: 'Job Template',
      can_edit: true,
    },
    {
      additional_errors: null,
      errors: {
        base: [
          '»This template is locked. Please clone it to a new template to customize.«',
        ],
      },
      name: 'Ansible Roles - Install from Galaxy',
      template_file: 'ansible_roles_-_install_from_galaxy.erb',
      additional_info: null,
      id: 224,
      snippet: false,
      locked: true,
      kind: null,
      class_name: 'JobTemplate',
      humanized_class_name: 'Job Template',
      can_edit: true,
    },
    {
      additional_errors: null,
      errors: {
        base: [
          '»This template is locked. Please clone it to a new template to customize.«',
        ],
      },
      name: 'Ansible Roles - Install from git',
      template_file: 'ansible_roles_-_install_from_git.erb',
      additional_info: null,
      id: 225,
      snippet: false,
      locked: true,
      kind: null,
      class_name: 'JobTemplate',
      humanized_class_name: 'Job Template',
      can_edit: true,
    },
    {
      additional_errors: null,
      errors: {},
      name: 'Capsule Upgrade Playbook',
      template_file: 'capsule_upgrade_-_ansible_default.erb',
      additional_info: null,
      id: 277,
      snippet: false,
      locked: false,
      kind: null,
      class_name: 'JobTemplate',
      humanized_class_name: 'Job Template',
      can_edit: true,
    },
  ],
  result_action: 'import',
};

export const mockTemplateSyncImport = deepPropsToCamelCase(
  receivedTemplatesData
);
