/**
 * Options for the getDomain method on the VseDomainFactory
 */
export interface GetDomainOptions {
  /**
   * Snapshot Id value
   * @type string
   */
  snapshotId?: string;

  /**
   * Epoch Timestamp in seconds
   * @type number
   */
  timestamp?: number;
}
