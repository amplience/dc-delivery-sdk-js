/**
 * @hidden
 */
interface WalkAndReplaceOptions {
  beforeWalk?(value: any, pointer: string[]): any;
  afterWalk?(value: any, pointer: string[]): any;
}

/**
 * @hidden
 */
export function walkAndReplace(
  value: any,
  options: WalkAndReplaceOptions,
  pointer: string[] = []
): Record<string, any> {
  if (options.beforeWalk) {
    value = options.beforeWalk(value, pointer);
  }

  if (Array.isArray(value)) {
    const newValue = [];
    for (let i = 0; i < value.length; i++) {
      let entryValue = value[i];
      entryValue = walkAndReplace(entryValue, options, pointer.concat(`${i}`));
      newValue.push(entryValue);
    }
    value = newValue;
  } else if (typeof value === 'object' && value !== null) {
    const newValue = {};
    const keys = Object.keys(value);
    for (const entryKey of keys) {
      let entryValue = value[entryKey];
      entryValue = walkAndReplace(
        entryValue,
        options,
        pointer.concat(entryKey)
      );
      newValue[entryKey] = entryValue;
    }
    value = newValue;
  }

  if (options.afterWalk) {
    value = options.afterWalk(value, pointer);
  }

  return value;
}
