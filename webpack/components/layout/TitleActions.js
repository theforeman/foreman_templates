import React from 'react';

const TitleActions = ({ children, className = 'col-md-12' }) => (
  <div id="title_action" className={className}>
    <div className="btn-toolbar pull-right">
      { children }
    </div>
  </div>
);

export default TitleActions;
