#!/bin/bash
set -ev
if [[ $( git diff --name-only HEAD~1..HEAD -- config/webpack.config.js webpack/ .travis.yml package.json script/run_travis_tests.sh | wc -l ) -ne 0 ]]; then
  npm run lint;
  npm run test;
fi
