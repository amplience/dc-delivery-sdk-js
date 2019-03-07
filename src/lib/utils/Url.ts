/**
 * @hidden
 */
export function encodeQueryString(queryParameters: string[][]) {
  return queryParameters
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}
