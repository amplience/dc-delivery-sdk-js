import { ContentClientConfigV1 } from './ContentClientConfigV1';
import { ContentClientConfigV2 } from './ContentClientConfigV2';
import { ContentClientConfigV2Fresh } from './ContentClientConfigV2Fresh';
import { CommonContentClientConfig } from './CommonContentClientConfig';

export {
  CommonContentClientConfig,
  ContentClientConfigV1,
  ContentClientConfigV2,
  ContentClientConfigV2Fresh,
};

/**
 * Union type of all configurations
 * @param config
 * @hidden
 */
export type ContentClientConfigOptions =
  | ContentClientConfigV1
  | ContentClientConfigV2
  | ContentClientConfigV2Fresh;

/**
 * Whether content client config is for Content Delivery v1
 * @param config
 * @hidden
 */
export function isContentClientConfigV1(
  config: ContentClientConfigOptions
): config is ContentClientConfigV1 {
  return (config as ContentClientConfigV1).account !== undefined;
}

/**
 * Whether content client config is for Content Delivery v2
 * @param config
 * @hidden
 */
export function isContentClientConfigV2(
  config: ContentClientConfigOptions
): config is ContentClientConfigV2 {
  return (config as ContentClientConfigV2).hubName !== undefined;
}

/**
 * Whether content client config is for Content Delivery v2 Fresh
 * @param config
 * @hidden
 */
export function isContentClientConfigV2Fresh(
  config: ContentClientConfigOptions
): config is ContentClientConfigV2Fresh {
  return (
    isContentClientConfigV2(config) &&
    (config as ContentClientConfigV2Fresh).apiKey !== undefined
  );
}
