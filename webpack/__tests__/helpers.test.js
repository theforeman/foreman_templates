import React from 'react';
import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
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
