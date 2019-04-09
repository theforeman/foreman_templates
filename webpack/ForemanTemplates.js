import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import Routes from './Routes';

const ForemanTemplates = ({ data }) => (
  <Router>
    <Routes
      apiUrls={data.apiUrls}
      validationData={data.validationData}
      editPaths={data.editPaths}
      fileRepoStartWith={data.fileRepoStartWith}
      userPermissions={data.userPermissions}
    />
  </Router>
);

ForemanTemplates.propTypes = {
  data: PropTypes.shape({
    apiUrls: PropTypes.object,
    validationData: PropTypes.object,
    editPaths: PropTypes.object,
    userPermissions: PropTypes.object,
    fileRepoStartWith: PropTypes.array,
  }).isRequired,
};

export default ForemanTemplates;
