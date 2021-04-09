import * as Yup from 'yup';

export const redirectToResult = history => () =>
  history.push({ pathname: '/template_syncs/result' });

export const repoFormat = formatAry => value => {
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
              `Invalid repo format, must start with one of: ${validationData.repo.join(
                ', '
              )}`,
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
