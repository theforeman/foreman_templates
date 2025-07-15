import { isValidUrl, validateRepository } from '../NewTemplateSyncFormHelpers';

const allowed = [
  'http://',
  'https://',
  'git://',
  'ssh://',
  'git+ssh://',
  'ssh+git://',
  '/',
];

describe('isValidUrl', () => {
  test.each([
    [null, false],
    [undefined, false],
    ['', false],
    ['   ', false],
  ])('returns false for null/empty values: %p', (value, expected) => {
    expect(isValidUrl(value, allowed)).toBe(expected);
  });

  it('accepts file paths starting with "/" when "/" is allowed', () => {
    expect(isValidUrl('/tmp/dir', allowed)).toBe(true);
    expect(isValidUrl('   /var/lib  ', allowed)).toBe(true); // trims first
  });

  it('rejects file paths when "/" is NOT allowed', () => {
    const noSlash = allowed.filter(p => p !== '/');
    expect(isValidUrl('/tmp/dir', noSlash)).toBe(false);
  });

  it('accepts URLs whose protocol is in the allowlist', () => {
    expect(isValidUrl('https://example.com', allowed)).toBe(true);
    expect(isValidUrl('http://example.com', allowed)).toBe(true);
    expect(isValidUrl('ssh://host/path', allowed)).toBe(true);
    expect(isValidUrl('git+ssh://host/repo.git', allowed)).toBe(true);
  });

  it('rejects URLs with protocols not in the allowlist', () => {
    expect(isValidUrl('ftp://example.com', allowed)).toBe(false);
    // note: mailto is a valid URL, but not allowed here
    expect(isValidUrl('mailto:test@example.com', allowed)).toBe(false);
  });

  it('trims input before validating', () => {
    expect(isValidUrl('  https://example.com  ', allowed)).toBe(true);
  });

  it('returns false for malformed URLs', () => {
    expect(isValidUrl('not a url', allowed)).toBe(false);
    expect(isValidUrl('http//missing-colon.com', allowed)).toBe(false);
  });
});

describe('validateRepository', () => {
  it('returns "success" for an allowed URL', () => {
    expect(validateRepository('https://example.com', allowed)).toBe('success');
  });

  it('returns "success" for allowed file path when "/" allowed', () => {
    expect(validateRepository('/tmp/repo', allowed)).toBe('success');
  });

  it('returns "error" for disallowed protocol', () => {
    expect(validateRepository('ftp://example.com', allowed)).toBe('error');
  });

  it('returns "error" for empty or malformed input', () => {
    expect(validateRepository('', allowed)).toBe('error');
    expect(validateRepository('   ', allowed)).toBe('error');
    expect(validateRepository('not a url', allowed)).toBe('error');
  });

  it('returns "error" for file path when "/" not allowed', () => {
    const noSlash = allowed.filter(p => p !== '/');
    expect(validateRepository('/tmp/repo', noSlash)).toBe('error');
  });
});
