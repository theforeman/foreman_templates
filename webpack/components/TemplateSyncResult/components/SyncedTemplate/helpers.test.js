import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';

import { expandableContent } from './helpers';

const fixtures = {
  'should return no errors': () => expandableContent({}),
  'should return additional info': () =>
    expandableContent({ additionalInfo: 'This is additional info' }),
  'should return additional error': () =>
    expandableContent({ additionalErrors: 'These are additional errors' }),
  'should return attribute errors': () =>
    expandableContent({
      errors: {
        base: ['could not be processed'],
        name: ["can't be blank", 'has invalid format'],
      },
    }),
};

describe('expandableContent', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
