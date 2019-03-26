import React from 'react';
import { connect } from 'react-redux';

import * as TemplateSyncActions from './NewTemplateSyncActions';
import NewTemplateSync from './NewTemplateSync';
import { selectLoadingSettings, selectError } from './NewTemplateSyncSelectors';
import { withProtectedView } from '../../helpers';
import PermissionDenied from '../PermissionDenied';

const mapStateToProps = state => ({
  loadingSettings: selectLoadingSettings(state),
  error: selectError(state)
});

const permissionList = (
    <ul className="list-unstyled">
      <li>import_templates</li>
      <li>export_templates</li>
    </ul>
  );

export default withProtectedView(
  connect(mapStateToProps, TemplateSyncActions)(NewTemplateSync),
  PermissionDenied,
  (props) => props.userPermissions && (props.userPermissions.import || props.userPermissions.export),
  { doc: permissionList }
)
