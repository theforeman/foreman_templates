export const exportTemplates = [
  {
    name: 'random template',
    templateFile: 'random_template.erb',
    additionalErrors: null,
    errors: {},
    snippet: true,
    locked: true,
    className: 'JobTemplate',
    humanizedClassName: 'Job Template',
  },
  {
    name: 'CoreOS default',
    templateFile: 'coreos_default.erb',
    additionalErrors: null,
    errors: {},
    snippet: false,
    locked: false,
    className: 'Ptable',
    humanizedClassName: 'Ptable',
  },
];

export const noName = {
  name: null,
  templateFile: 'random_template.erb',
  additionalErrors: ['No "name" found in metadata'],
  errors: null,
};

export const epel = {
  name: 'EPEL',
  templateFile: 'epel.erb',
  additionalErrors: null,
  errors: { base: ['This template is locked'] },
  snippet: true,
  locked: true,
  className: 'ProvisioningTemplate',
  kind: 'Provision',
  humanizedClassName: 'Provisioning Template',
};

export const coreos = {
  name: 'CoreOS default',
  templateFile: 'coreos_default.erb',
  additionalErrors: null,
  errors: {},
  snippet: false,
  locked: false,
  className: 'Ptable',
  humanizedClassName: 'Ptable',
};

export const filteredOut = {
  name: 'CoreOS default',
  templateFile: 'coreos_default.erb',
  additionalErrors: null,
  additionalInfo: ['Skipping, this template was filtered out.'],
  errors: {},
  snippet: false,
  locked: false,
  className: 'Ptable',
  humanizedClassName: 'Ptable',
};

export const importTemplates = [
  noName,
  epel,
  coreos,
  {
    name: null,
    templateFile: 'no_model.erb',
    additionalErrors: 'No "model" found in metadata',
    errors: null,
  },
  {
    name: 'Kickstart fake',
    templateFile: 'kickstart_fake.erb',
    additionalErrors: null,
    errors: { name: ['has already been taken'] },
    snippet: true,
    locked: true,
    className: 'ProvisioningTemplate',
    humanizedClassName: 'Provisioning Template',
  },
];
