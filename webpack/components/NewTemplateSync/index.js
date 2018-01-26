import React from 'react';
import { connect } from 'react-redux';

import * as TemplateSyncActions from './NewTemplateSyncActions';
import NewTemplateSync from './NewTemplateSync';
import { selectLoadingSettings, selectError } from './NewTemplateSyncSelectors';

const mapStateToProps = state => ({
  loadingSettings: selectLoadingSettings(state),
  error: selectError(state)
});

export default connect(mapStateToProps, TemplateSyncActions)(NewTemplateSync);
