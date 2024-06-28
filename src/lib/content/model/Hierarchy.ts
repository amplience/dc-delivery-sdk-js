/**
 * Hierarchy status of a ContentItem.
 */
export interface Hierarchy {
  /**
   * Determines Hierarchy is the root item
   */
  root: boolean;
  /**
   * Parent ID of a Hierarchy
   */
  parentId?: string;
}
