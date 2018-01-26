import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TemplateSyncResult from './TemplateSyncResult';
import * as TemplateSyncResultActions from './TemplateSyncResultActions';

import { selectSyncResult } from './TemplateSyncResultSelectors';

const mapStateToProps = state => ({ syncResult: selectSyncResult(state) });

export default connect(mapStateToProps, TemplateSyncResultActions)(TemplateSyncResult);
