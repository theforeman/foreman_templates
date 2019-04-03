import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import TextButtonField from '../TextButtonField';

const textItem = {
  type: 'text'
};

const unspecifiedItem = {};

const selectItem = {
  type: 'select',
  selection: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' },
  ]
};

const checkboxItem = {
  type: 'checkbox'
};

const blank = { label: 'Bare Metal', value: 'bareMetal' };

const fieldSelector = item => item.type;

const fixtures = {
  'should render text item': {
    item: textItem,
    fieldSelector,
    disabled: false,
    label: 'Text',
    blank: {}
  },
  'should render checkbox item': {
    item: checkboxItem,
    fieldSelector,
    disabled: false,
    label: 'Checkbox',
    blank: {}
  },
  'should render select item with custom blank opt': {
    item: selectItem,
    fieldSelector,
    label: 'Select',
    disabled: false,
    blank,
  },
  'should render text field without field selector': {
    label: 'Text field',
    disabled: false,
    blank: {},
  }
}

describe('TextButtonField', () =>
  testComponentSnapshotsWithFixtures(TextButtonField, fixtures));
