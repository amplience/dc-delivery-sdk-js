/**
 * Options for the generateDomain method on the StagingEnvironmentFactory
 */
export interface GenerateDomainOptions {
  /**
   * Snapshot Id
   * @type string
   */
  snapshotId?: string;

  /**
   * Timestamp in milliseconds (unix epoch ms)
   * @type number
   */
  timestamp?: number;
}
