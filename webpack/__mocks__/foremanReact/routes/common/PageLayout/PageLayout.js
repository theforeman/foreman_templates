import React from 'react';
import PropTypes from 'prop-types';

const PageLayout = ({ children }) => <div>{children}</div>;

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageLayout;
