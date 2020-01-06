import React from 'react';
import { isEmpty } from 'lodash';
import { Icon } from 'patternfly-react';

import IconInfoItem from './IconInfoItem';
import EmptyInfoItem from './EmptyInfoItem';
import StringInfoItem from './StringInfoItem';
import LinkInfoItem from './LinkInfoItem';

export const itemIteratorId = (template, ...rest) =>
  `${template.templateFile}-${rest.join('-')}`;

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
          <LinkInfoItem
            template={template}
            editPath={editPath}
            attr={attr}
            key={key}
          />
        );
      default:
        return '';
    }
  });
};

export const itemLeftContentIcon = template => {
  let iconName = template.additionalInfo ? 'warning-triangle-o' : undefined;

  if (!iconName) {
    iconName = isEmpty(aggregatedErrors(template)) ? 'ok' : 'error-circle-o';
  }
  return <Icon name={iconName} size="sm" type="pf" />;
};

export const expandableContent = template => {
  if (Object.keys(aggregatedMessages(template)).length !== 0) {
    const msgs = aggregatedMessages(template);

    const res = Object.keys(msgs).map(key => {
      const errorMsgs = aggregatedMessages(template)[key];
      return errorMsgs.map((errValue, idx) => (
        <li key={itemIteratorId(template, key, idx)}>
          {formatError(key, errValue)}
        </li>
      ));
    });
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

const aggregatedMessages = template => {
  const errors = aggregatedErrors(template);
  if (template.additionalInfo) {
    errors.info = template.additionalInfo;
  }
  return errors;
};

const formatError = (key, value) => {
  const omitKeys = ['base', 'additional', 'info'];
  if (omitKeys.filter(item => key === item)) {
    return value;
  }

  return `${key}: ${value}`;
};
