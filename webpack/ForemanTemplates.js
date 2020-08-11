import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import Routes from './Routes';

const ForemanTemplates = ({
  apiUrls,
  validationData,
  fileRepoStartWith,
  userPermissions,
  editPaths,
}) => (
  <Router>
    <Routes
      apiUrls={apiUrls}
      validationData={validationData}
      editPaths={editPaths}
      fileRepoStartWith={fileRepoStartWith}
      userPermissions={userPermissions}
    />
  </Router>
);

ForemanTemplates.propTypes = {
  apiUrls: PropTypes.object.isRequired,
  validationData: PropTypes.object.isRequired,
  editPaths: PropTypes.object.isRequired,
  userPermissions: PropTypes.object.isRequired,
  fileRepoStartWith: PropTypes.array.isRequired,
};

export default ForemanTemplates;
