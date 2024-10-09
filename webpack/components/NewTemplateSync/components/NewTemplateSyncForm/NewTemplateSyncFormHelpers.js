import * as Yup from 'yup';
import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';

export const redirectToResult = history => () =>
  history.push({ pathname: '/template_syncs/result' });

const repoFormat = formatAry => value => {
  if (value === undefined) {
    return true;
  }

  const valid = formatAry
    .map(item => value.startsWith(item))
    .reduce((memo, item) => item || memo, false);

  return value && valid;
};

export const syncFormSchema = (syncType, settingsObj, validationData) => {
  const schema = (settingsObj[syncType].asMutable() || []).reduce(
    (memo, setting) => {
      if (setting.name === 'repo') {
        return {
          ...memo,
          repo: Yup.string()
            .test(
              'repo-format',
              `${__(
                'Invalid repo format, must start with one of: '
              )}${validationData.repo.join(', ')}`,
              repoFormat(validationData.repo)
            )
            .required("can't be blank"),
        };
      }
      return memo;
    },
    {}
  );

  return Yup.object().shape({
    [syncType]: Yup.object().shape(schema),
  });
};

export const tooltipContent = setting => (
  <div
    dangerouslySetInnerHTML={{
      __html: __(setting.description),
    }}
  />
);

export const label = setting => `${__(setting.fullName)}`;
