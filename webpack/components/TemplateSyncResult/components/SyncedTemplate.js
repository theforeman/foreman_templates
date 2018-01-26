import React from 'react';
import { ListView, Grid, Icon, OverlayTrigger, Tooltip } from 'patternfly-react';
import classNames from 'classnames';
import { pick, mergeWith, isEmpty } from 'lodash';

const StringInfoItem = ({ template, attr, tooltipText, translate = false }) => {
    return (<InfoItem itemId={itemIteratorId(template, attr)}
                      tooltipText={tooltipText}>
              <strong>{ translate ? __(template[attr]) : template[attr] }</strong>
            </InfoItem>);
};

const IconInfoItem = ({ template, attr, cssClassNames, tooltipText }) => {
  return (<InfoItem itemId={itemIteratorId(template, attr)}
                    tooltipText={tooltipText}>
            <span className={cssClassNames} />
          </InfoItem>);
};

const EmptyInfoItem = (template, attr) => (
  <InfoItem itemId={itemIteratorId(template, attr)} />
);

const InfoItem = ({ itemId, children, tooltipText }) => {
  const overlay = (
    <OverlayTrigger overlay={tooltipText ? (<Tooltip id={itemId}>{ tooltipText }</Tooltip>) : ''}
                    placement="top"
                    trigger={['hover', 'focus']}
                    rootClose={false}
                    >
        { children }
      </OverlayTrigger>
    )
  return (
    <ListView.InfoItem key={itemId} className='additional-info-wide'>
      { tooltipText ? overlay : children }
    </ListView.InfoItem>
  );
}

const itemIteratorId = (template, attr) =>
  `${template.name}-${attr}`;

const SyncedTemplate = props => {
  const { template } = props;

  const additionalInfo = (template) => {
    const infoAttrs = ['locked', 'snippet', 'class_name', 'kind'];

    return infoAttrs.map((attr) => {
      const key = itemIteratorId(template, attr)

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
        case 'class_name':
          return (<StringInfoItem template={template}
                                  attr={attr}
                                  translate={true}
                                  key={key} />);
        case 'kind':
          return (<StringInfoItem template={template}
                                  attr={attr}
                                  key={key} />);
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

  return (
      <ListView.Item
        key={template.id}
        heading={template.name}
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

export default SyncedTemplate;
