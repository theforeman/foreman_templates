import Immutable from 'seamless-immutable';

export const associateSetting = Immutable({
  id: 45,
  value: "new",
  settingsType: 'string',
  name: 'associate',
  selection: [
    { value: 'new', label: 'New' },
    { value: 'never', label: 'Never' },
    { value: 'always', label: 'Always' },
  ]
});

export const forceSetting = Immutable({
  id: 46,
  value: false,
  settingsType: 'bool',
  name: 'force'
});

export const importSettings = [associateSetting, forceSetting]

export const filterSetting = Immutable({
  id: 47,
  value: "",
  settingsType: 'string',
  name: 'filter'
});

export const negateSetting = Immutable({
  id: 48,
  value: false,
  settingsType: 'bool',
  name: 'negate',
});

export const repoSetting = Immutable({
  id: 49,
  value: 'https://github.com/theforeman/community-templates.git',
  settingsType: 'string',
  name: 'repo',
});

export const exportSettings = [filterSetting, negateSetting, repoSetting];

const registeredSettings = settings => settings.reduce(
  (memo, item) => {
    memo[item.name] = item;
    return memo;
  },
  {});

export const registeredImportSettings = { registeredFields: registeredSettings(importSettings) };
export const registeredExportSettings = { registeredFields: registeredSettings(exportSettings) };

export const initialValues = {
  initial: importSettings.concat(exportSettings).reduce(
    (memo, item) => {
      memo[item.name] = item.value;
      return memo;
    },
    {})
}

export const stateFactory = obj => ({
  foremanTemplates: {
    syncSettings: obj
  }
});

