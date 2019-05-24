import React from 'react';
import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { deepPropsToCamelCase, withProtectedView } from '../helpers';
import withProtectedView from '../withProtectedView';

const ProtectedComponent = () => <div>Protected component</div>;

const ProtectionComponent = () => <div>Protection component</div>;

const fixtures = {
  'should return protected component': () =>
    withProtectedView(ProtectedComponent, ProtectionComponent, () => true)(),
  'should return protection component': () =>
    withProtectedView(ProtectedComponent, ProtectionComponent, () => false)(),
};

describe('withProtectedView', () =>
  testSelectorsSnapshotWithFixtures(fixtures));

describe('deepPropsToCamelCase', () => {
  const deepProps = {
    my_key: [],
    array_key: ['a', 'b'],
    object_key: { nested_key: 'value' },
    null_key: null,
    undefined_key: undefined,
    zero_key: 0,
    string_key: '',
    string_key_again: 'test',
    nested_array: [{ random_key: 'random_value' }],
    not_number_key: NaN,
  };

  const deepCamelProps = {
    myKey: [],
    arrayKey: ['a', 'b'],
    objectKey: { nestedKey: 'value' },
    nullKey: null,
    undefinedKey: undefined,
    zeroKey: 0,
    stringKey: '',
    stringKeyAgain: 'test',
    nestedArray: [{ randomKey: 'random_value' }],
    notNumberKey: NaN,
  };

  it('should transform props', () => {
    expect(deepPropsToCamelCase(deepProps)).toEqual(deepCamelProps);
  });
});
