import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import TextButtonField from '../TextButtonField';

const textItem = {
  type: 'text',
};

const selectItem = {
  type: 'select',
  selection: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' },
  ],
};

const checkboxItem = {
  type: 'checkbox',
};

const blank = { label: 'Bare Metal', value: 'bareMetal' };

const fieldSelector = item => item.type;
const buttonAttrs = { buttonText: 'Button', buttonAction: () => {} };

const fixtures = {
  'should render text item': {
    name: 'Text field',
    item: textItem,
    fieldSelector,
    ...buttonAttrs,
    disabled: false,
    label: 'Text',
    blank: {},
  },
  'should render checkbox item': {
    name: 'Checkbox field',
    item: checkboxItem,
    fieldSelector,
    ...buttonAttrs,
    disabled: false,
    label: 'Checkbox',
    blank: {},
  },
  'should render select item with custom blank opt': {
    name: 'select field',
    item: selectItem,
    fieldSelector,
    ...buttonAttrs,
    label: 'Select',
    disabled: false,
    blank,
  },
  'should render text field without field selector': {
    name: 'no selector',
    label: 'Text field',
    ...buttonAttrs,
    disabled: false,
    blank: {},
  },
};

describe('TextButtonField', () =>
  testComponentSnapshotsWithFixtures(TextButtonField, fixtures));
