import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

export default (props) => {
  console.log(props)
  return (
    <Router>
      <Routes
        apiUrls={props.data.apiUrls}
        validationData={props.data.validationData}
        editPaths={props.data.editPaths}
        userPermissions={props.data.userPermissions} />
    </Router>
  );
}

