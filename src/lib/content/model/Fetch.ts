import { ContentNotFoundError } from './ContentNotFoundError';
import { ContentItemResponse, RequestOptions } from './FilterBy';

type FetchRequestWithId = {
  id: string;
};

type FetchRequestWithKey = {
  key: string;
};

/**
 * @hidden
 */
export type FetchRequestType =
  | keyof FetchRequestWithId
  | keyof FetchRequestWithKey;

export type FetchResponse<Body> = {
  responses: Array<
    | ContentItemResponse<Body>
    | {
        error: ContentNotFoundError;
      }
  >;
};

export type FetchRequest = {
  requests: Array<FetchRequestWithId | FetchRequestWithKey>;
  parameters?: RequestOptions;
};
