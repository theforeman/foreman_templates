export const isValidUrl = (value, allowedProtocols) => {
  if (value == null) return false;

  const v = String(value).trim();
  if (!v) return false;

  if (allowedProtocols.includes('/') && v.startsWith('/')) return true;

  try {
    const url = new URL(v);
    const protoPrefix = `${url.protocol}//`;
    return allowedProtocols.includes(protoPrefix);
  } catch {
    return false;
  }
};

export const validateRepository = (value, validationData) => {
  if (!isValidUrl(value, validationData)) return 'error';

  return 'success';
};
