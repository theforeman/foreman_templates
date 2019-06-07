import Immutable from 'seamless-immutable';

import { transformInitialValues } from '../components/NewTemplateSyncForm/NewTemplateSyncFormSelectors';

export const associateSetting = Immutable({
  id: 45,
  value: 'new',
  settingsType: 'string',
  name: 'associate',
  description: 'Associate templates to OS, organization and location',
  selection: [
    { value: 'new', label: 'New' },
    { value: 'never', label: 'Never' },
    { value: 'always', label: 'Always' },
  ],
});

export const forceSetting = Immutable({
  id: 46,
  value: false,
  settingsType: 'bool',
  name: 'force',
  description: 'Should importing overwrite locked templates?',
});

export const importSettings = [associateSetting, forceSetting];

export const filterSetting = Immutable({
  id: 47,
  value: '',
  settingsType: 'string',
  name: 'filter',
  description:
    'Import or export names matching this regex (case-insensitive; snippets are not filtered)',
});

export const negateSetting = Immutable({
  id: 48,
  value: false,
  settingsType: 'bool',
  name: 'negate',
  description: 'Negate the filter for import/export',
});

export const repoSetting = Immutable({
  id: 49,
  value: 'https://github.com/theforeman/community-templates.git',
  settingsType: 'string',
  name: 'repo',
  description:
    'Target path to import and export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.',
});

export const exportSettings = [filterSetting, negateSetting, repoSetting];

const registeredSettings = settings =>
  settings.reduce((memo, item) => {
    memo[item.name] = item;
    return memo;
  }, {});

export const registeredImportSettings = {
  registeredFields: registeredSettings(importSettings),
};
export const registeredExportSettings = {
  registeredFields: registeredSettings(exportSettings),
};

export const initialValues = {
  import: transformInitialValues(importSettings),
  export: transformInitialValues(exportSettings),
};

export const stateFactory = obj => ({
  foremanTemplates: {
    syncSettings: obj,
  },
});
