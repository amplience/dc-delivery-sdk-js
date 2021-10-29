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

type ContentClientConfig =
  | ContentClientConfigV1
  | ContentClientConfigV2
  | ContentClientConfigV2Fresh;

export function isContentClientConfigV1(
  config: ContentClientConfig
): config is ContentClientConfigV1 {
  return (config as ContentClientConfigV1).account !== undefined;
}

export function isContentClientConfigV2(
  config: ContentClientConfig
): config is ContentClientConfigV2 {
  return (config as ContentClientConfigV2).hubName !== undefined;
}

export function isContentClientConfigV2Fresh(
  config: ContentClientConfig
): config is ContentClientConfigV2Fresh {
  return (
    isContentClientConfigV2(config) &&
    (config as ContentClientConfigV2Fresh).apiKey !== undefined
  );
}
