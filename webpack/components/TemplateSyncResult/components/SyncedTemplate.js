import React from 'react';
import { ListView, Icon } from 'patternfly-react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import InfoItem from './InfoItem';
import StringInfoItem, { itemIteratorId } from './StringInfoItem';

const IconInfoItem = ({ template, attr, iconName, tooltipText }) => (
  <InfoItem itemId={itemIteratorId(template, attr)} tooltipText={tooltipText}>
    <Icon type="fa" name={iconName}/>
  </InfoItem>
);

IconInfoItem.propTypes = {
  template: PropTypes.object.isRequired,
  attr: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  tooltipText: PropTypes.string.isRequired,
};

const EmptyInfoItem = ({ template, attr }) => (
  <InfoItem itemId={itemIteratorId(template, attr)} />
);

EmptyInfoItem.propTypes = {
  template: PropTypes.object.isRequired,
  attr: PropTypes.string.isRequired,
};

const additionalInfo = template => {
  const infoAttrs = [
    'locked',
    'snippet',
    'humanizedClassName',
    'kind',
    'templateFile',
  ];

  return infoAttrs.map(attr => {
    const key = itemIteratorId(template, attr);

    const classNameMap = { Ptable: 'Partition Table' };

    if (!template[attr]) {
      return <EmptyInfoItem template={template} attr={attr} key={key} />;
    }

    switch (attr) {
      case 'locked':
        return (
          <IconInfoItem
            template={template}
            attr={attr}
            iconName="lock"
            tooltipText="Locked"
            key={key}
          />
        );
      case 'snippet':
        return (
          <IconInfoItem
            template={template}
            attr={attr}
            iconName="check"
            tooltipText="Snippet"
            key={key}
          />
        );
      case 'humanizedClassName':
        return (
          <StringInfoItem
            template={template}
            attr={attr}
            translate
            mapAttr={(templateObj, attribute) =>
              classNameMap[templateObj[attribute]]
                ? classNameMap[templateObj[attribute]]
                : templateObj[attribute]
            }
            key={key}
          />
        );
      case 'kind':
        return <StringInfoItem template={template} attr={attr} key={key} />;
      case 'templateFile':
        return (
          <StringInfoItem template={template} attr={attr} key={key} elipsed />
        );
      default:
        return '';
    }
  });
};

const aggregatedErrors = template => {
  const err = { ...template.errors } || {};
  if (template.additional_errors) {
    err.additional = template.additional_errors;
  }

  return err;
};

const itemLeftContentIcon = template => {
  const iconName = isEmpty(aggregatedErrors(template))
    ? 'ok'
    : 'error-circle-o';
  return <Icon name={iconName} size="sm" type="pf" />;
};

const templateErrors = template => {
  if (Object.keys(aggregatedErrors(template)).length !== 0) {
    const res = Object.keys(aggregatedErrors(template)).map(key => (
      <li key={itemIteratorId(template, key)}>
        {formatError(key, aggregatedErrors(template)[key])}
      </li>
    ));
    return <ul>{res}</ul>;
  }
  return <span>There were no errors.</span>;
};

const templateHeading = (template, editPath) => {
  if (template.id && template.canEdit) {
    return (
      <a
        href={editPath.replace(':id', template.id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {template.name}
      </a>
    );
  }
  return template.name || ' ';
};

const formatError = (key, value) => {
  const omitKeys = ['base', 'additional'];
  if (omitKeys.reduce((memo, item) => memo || key === item, false)) {
    return value;
  }

  return `${key}: ${value}`;
};

const SyncedTemplate = ({ template, editPath }) => (
  <ListView.Item
    key={template.id}
    heading={templateHeading(template, editPath)}
    additionalInfo={additionalInfo(template)}
    className="listViewItem--listItemVariants"
    leftContent={itemLeftContentIcon(template)}
    hideCloseIcon
    stacked
  >
    {templateErrors(template)}
  </ListView.Item>
);

SyncedTemplate.propTypes = {
  template: PropTypes.object.isRequired,
  editPath: PropTypes.string,
};

SyncedTemplate.defaultProps = {
  editPath: '',
};

export default SyncedTemplate;
