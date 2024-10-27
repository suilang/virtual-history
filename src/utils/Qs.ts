import qs from 'query-string';

export function addQuery(href: string, data: { [key: string]: any }, delKeys?: string[]) {
  const url = new URL(href);
  const parsed = qs.parse(url.search);
  Object.assign(parsed, data);
  delKeys?.forEach((key) => {
    delete parsed[key];
  });
  const stringified = qs.stringify(parsed);
  url.search = stringified;
  return url.href;
}

export function removeQuery(href: string, keys: string[]) {
  return qs.exclude(href, keys);
}

export function getQuery(href = location.href): { [key: string]: any | null } {
  const { query } = qs.parseUrl(href, { parseBooleans: true });
  return query as any;
}
