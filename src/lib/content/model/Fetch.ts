import { ContentNotFoundError } from './ContentNotFoundError';
import { ContentItemResponse, RequestOptions } from './FilterBy';

export type FetchRequestBodyWithId = {
  id: string;
};

export type FetchRequestBodyWithKey = {
  key: string;
};

export type FetchRequestBodyType =
  | keyof FetchRequestBodyWithId
  | keyof FetchRequestBodyWithKey;

export type FetchResponse<Body> = {
  responses: Array<
    | ContentItemResponse<Body>
    | {
        error: ContentNotFoundError;
      }
  >;
};

export type FetchRequestBody = {
  requests: Array<FetchRequestBodyWithId | FetchRequestBodyWithKey>;
  parameters?: RequestOptions;
};
