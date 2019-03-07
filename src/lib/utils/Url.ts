/**
 * @hidden
 */
export function encodeQueryString(queryParameters: string[][]) {
  const components = [];
  for (const keyValuePair of queryParameters) {
    const key = keyValuePair[0];
    const value = keyValuePair[1];
    components.push(`${key}=${encodeURIComponent(value)}`);
  }
  return components.join('&');
}
