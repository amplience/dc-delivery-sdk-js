/**
 * @hidden
 * Class providing meta data about a fragment of content with helper functions.
 */
export class FragmentMeta {
  /**
   * URI of the JSON-schema used to create this fragment of content
   */
  schema: string;

  /**
   * Creates a new FragmentMeta instance.
   * @param data JSON representation of the FragmentMeta model
   */
  constructor(data?: any) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Export to JSON
   */
  toJSON(): any {
    return {
      schema: this.schema,
    };
  }

  /**
   * @hidden
   * Returns true if the provided node contains meta data to self-describe the JSON schema it was created against.
   * @param node JSON node to test
   */
  public static isFragment(node: any): boolean {
    return node != null && node._meta != null && node._meta.schema != null;
  }
}
