import React from 'react';
import { isEmpty } from 'lodash';
import { Icon } from 'patternfly-react';

import IconInfoItem from './IconInfoItem';
import EmptyInfoItem from './EmptyInfoItem';
import StringInfoItem from './StringInfoItem';
import LinkInfoItem from './LinkInfoItem';

export const itemIteratorId = (template, attr) =>
  `${template.templateFile}-${attr}`;

export const additionalInfo = (template, editPath) => {
  const infoAttrs = [
    'name',
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
      case 'name':
        return (
          <LinkInfoItem template={template} editPath={editPath} attr={attr} />
        );
      default:
        return '';
    }
  });
};

export const itemLeftContentIcon = template => {
  const iconName = isEmpty(aggregatedErrors(template))
    ? 'ok'
    : 'error-circle-o';
  return <Icon name={iconName} size="sm" type="pf" />;
};

export const templateHeading = (template, editPath) => {
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

export const templateErrors = template => {
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

const aggregatedErrors = template => {
  const err = { ...template.errors } || {};
  if (template.additionalErrors) {
    err.additional = template.additionalErrors;
  }

  return err;
};

const formatError = (key, value) => {
  const omitKeys = ['base', 'additional'];
  if (omitKeys.reduce((memo, item) => memo || key === item, false)) {
    return value;
  }

  return `${key}: ${value}`;
};
