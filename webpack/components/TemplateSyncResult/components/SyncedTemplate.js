import React from 'react';
import { ListView, Grid, Icon, OverlayTrigger, Tooltip } from 'patternfly-react';
import classNames from 'classnames';
import { pick, mergeWith, isEmpty } from 'lodash';
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';
import PropTypes from 'prop-types';

import InfoItem from './InfoItem';
import StringInfoItem, { itemIteratorId } from './StringInfoItem';

const IconInfoItem = ({ template, attr, cssClassNames, tooltipText }) => {
  return (<InfoItem itemId={itemIteratorId(template, attr)}
                    tooltipText={tooltipText}>
            <span className={cssClassNames} />
          </InfoItem>);
};

const EmptyInfoItem = ({ template, attr }) => (
  <InfoItem itemId={itemIteratorId(template, attr)} />
);

const SyncedTemplate = ({ template, editPath }) => {
  const additionalInfo = (template) => {
    const infoAttrs = ['locked', 'snippet', 'humanizedClassName', 'kind', 'templateFile'];

    return infoAttrs.map((attr) => {
      const key = itemIteratorId(template, attr);

      const classNameMap = { Ptable: 'Partition Table' };


      if (!template[attr]) {
        return (<EmptyInfoItem template={template} attr={attr} key={key}/>);
      }

      switch(attr) {
        case 'locked':
          return (<IconInfoItem template={template}
                                attr={attr}
                                cssClassNames={'glyphicon glyphicon-lock'}
                                tooltipText='Locked'
                                key={key} />)
        case 'snippet':
          return (<IconInfoItem template={template}
                                attr={attr}
                                cssClassNames={'glyphicon glyphicon-scissors'}
                                tooltipText={'Snippet'}
                                key={key} />);
        case 'humanizedClassName':
          return (<StringInfoItem template={template}
                                  attr={attr}
                                  translate={true}
                                  mapAttr={(template, attr) => (classNameMap[template[attr]] ? classNameMap[template[attr]] : template[attr]) }
                                  key={key} />);
        case 'kind':
          return (<StringInfoItem template={template}
                                  attr={attr}
                                  key={key} />);
        case 'templateFile':
          return (
              <StringInfoItem template={template}
                              attr={attr}
                              key={key}
                              elipsed={true} />
            )
      }
    });
  };

  const aggregatedErrors = template => {
    const err = { ...template.errors } || {};
    if (template.additional_errors) {
      err.additional = template.additional_errors
    }

    return err;
  }

  const itemLeftContentIcon = (template) => {
    const iconName =  isEmpty(aggregatedErrors(template)) ? 'ok' : 'error-circle-o';
    return (<Icon name={iconName} size="sm" type={'pf'} />);
  }

  const formatError = (key, value) => {
    const omitKeys = ['base', 'additional'];
    if (omitKeys.reduce((memo, item) => (memo || key === item), false)) {
      return value;
    }

    return `${key}: ${value}`;
  }

  const templateErrors = (template) => {
    if (Object.keys(aggregatedErrors(template)).length !== 0) {
      const res = Object.keys(aggregatedErrors(template)).map((key) => {
        return (<li key={itemIteratorId(template, key)}>{ formatError(key, aggregatedErrors(template)[key]) }</li>)
      });
      return (<ul>{ res }</ul>);
    }
    return (<span>There were no errors.</span>);
  }

  const templateHeading = (template, editPath) => {
    if (template.id) {
      return <a href={editPath.replace(':id', template.id)} target="_blank">{template.name}</a>
    }
    return template.name || ' ';
  }

  return (
      <ListView.Item
        key={template.id}
        heading={templateHeading(template, editPath)}
        additionalInfo={additionalInfo(template)}
        className={'listViewItem--listItemVariants'}
        leftContent={itemLeftContentIcon(template)}
        hideCloseIcon
        stacked
      >
        { templateErrors(template) }
    </ListView.Item>
  );
}

SyncedTemplate.propTypes = {
  template: PropTypes.object,
  editPath: PropTypes.string,
}

export default SyncedTemplate;
