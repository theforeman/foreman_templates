import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';
import { Icon, Tooltip } from '@patternfly/react-core';
import { Td, TableText } from '@patternfly/react-table';
import {
  LockIcon,
  CheckCircleIcon,
  CheckIcon,
  TimesCircleIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

export const itemIteratorId = (template, ...rest) =>
  `${template.templateFile}-${rest.join('-')}`;

const TooltipWrapper = ({ children, tooltipText }) => {
  if (!tooltipText) return children;
  return (
    <Tooltip content={tooltipText}>
      <span>{children}</span>
    </Tooltip>
  );
};

const LinkItem = ({ template, editPath }) => {
  if (template.id && template.canEdit) {
    const editUrl = editPath[template.className]?.replace(':id', template.id);

    return (
      <a href={editUrl} target="_blank" rel="noopener noreferrer">
        {template.name}
      </a>
    );
  }
  return template.name || '';
};

export const ItemWrapper = ({ children }) => <div>{children}</div>;

const TableCellWrapper = ({ children }) => (
  <Td>
    <TableText wrapModifier="truncate">{children}</TableText>
  </Td>
);

const extractAttr = (template, attr, classNameMap) =>
  classNameMap[template[attr]] ?? template[attr];

export const additionalInfo = (template, editPath) => {
  const infoAttrs = [
    'name',
    'locked',
    'snippet',
    'humanizedClassName',
    'kind',
    'templateFile',
  ];

  return infoAttrs.map((attr, index) => {
    const classNameMap = { Ptable: 'Partition Table' };
    const derivedKey = `${attr}-${template.id ?? index}`;

    if (!template[attr]) {
      return (
        <TableCellWrapper key={derivedKey}>
          <ItemWrapper key={index}> </ItemWrapper>
        </TableCellWrapper>
      );
    }

    switch (attr) {
      case 'locked':
        return (
          <TableCellWrapper key={derivedKey}>
            <TooltipWrapper tooltipText={__('Locked')} key={index}>
              <ItemWrapper>
                <Icon aria-label={__('Locked')}>
                  <LockIcon />
                </Icon>
              </ItemWrapper>
            </TooltipWrapper>
          </TableCellWrapper>
        );
      case 'snippet':
        return (
          <TableCellWrapper key={derivedKey}>
            <TooltipWrapper tooltipText={__('Snippet')} key={index}>
              <ItemWrapper>
                <Icon aria-label={__('Snippet')}>
                  <CheckIcon />
                </Icon>
              </ItemWrapper>
            </TooltipWrapper>
          </TableCellWrapper>
        );
      case 'humanizedClassName':
      case 'kind':
      case 'templateFile':
        return (
          <TableCellWrapper key={derivedKey}>
            <ItemWrapper key={index}>
              {extractAttr(template, attr, classNameMap)}
            </ItemWrapper>
          </TableCellWrapper>
        );
      case 'name':
        return (
          <TableCellWrapper key={derivedKey}>
            <LinkItem template={template} editPath={editPath} key={index} />
          </TableCellWrapper>
        );
      default:
        return (
          <TableCellWrapper key={derivedKey}>
            <ItemWrapper key={index}> </ItemWrapper>
          </TableCellWrapper>
        );
    }
  });
};

const statusIcon = (status, StatusIcon) => (
  <Icon status={status}>
    <StatusIcon className="c-icon" />
  </Icon>
);

export const itemLeftContentIcon = template => {
  if (template.additionalInfo) {
    return statusIcon('warning', ExclamationTriangleIcon);
  } else if (isEmpty(aggregatedErrors(template))) {
    return statusIcon('success', CheckCircleIcon);
  }
  return statusIcon('danger', TimesCircleIcon);
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
  return <div>{__('There were no errors.')}</div>;
};

const aggregatedErrors = template => {
  const err = { ...template.errors } || {};
  if (template.additionalErrors) {
    err.additional = [template.additionalErrors];
  }

  return err;
};

const aggregatedMessages = template => {
  const errors = aggregatedErrors(template);
  if (template.additionalInfo) {
    errors.info = [template.additionalInfo];
  }
  return errors;
};

const formatError = (key, value) => {
  const omitKeys = ['base', 'additional', 'info'];
  if (omitKeys.includes(key)) {
    return value;
  }

  return `${key}: ${value}`;
};

ItemWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

TableCellWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

LinkItem.propTypes = {
  template: PropTypes.object.isRequired,
  editPath: PropTypes.object.isRequired,
};

TooltipWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  tooltipText: PropTypes.string.isRequired,
};
