import { throttle } from 'lodash';
import fetch, { Response } from 'node-fetch';

import { hasDateOccured } from '@aon/util-date';
import { parsePuzzle, parseStarCounts } from '@aon/util-parse-html';

type FetchFn = () => Promise<unknown>;

const { NX_AOC_URL, NX_AOC_SESSION } = process.env;

export const fetchStarCounts = (year: number | never) =>
  typeof year !== 'number' || !hasDateOccured({ year, day: 1 })
    ? Promise.reject(Error('invalid date'))
    : throttledFetch(`/${year}`, res => res.text().then(html => parseStarCounts(html).map(stars => ({ stars }))));

export const fetchMainPuzzle = (year: number | never, day: number | never) =>
  typeof year !== 'number' || typeof day !== 'number' || !hasDateOccured({ year, day })
    ? Promise.reject(Error('invalid date'))
    : throttledFetch(`/${year}/day/${day}`, res => res.text().then(html => parsePuzzle(html, { year, day })));

export const fetchInput = (year: number | never, day: number | never) =>
  typeof year !== 'number' || typeof day !== 'number' || !hasDateOccured({ year, day })
    ? Promise.reject(Error('invalid date'))
    : throttledFetch(`/${year}/day/${day}/input`, res => res.text());

const throttledFns: { [uri: string]: FetchFn } = {};

const throttledFetch = <T>(uri: string, processResponse: (res: Response) => Promise<T>) => {
  if (!throttledFns[uri]) {
    throttledFns[uri] = throttle(() => aocFetch(uri).then(processResponse), 60000, { leading: true });
  }
  return throttledFns[uri]() as Promise<T>;
};

const aocFetch = async (url: string | URL = '') => {
  try {
    const response = await fetch(new URL(url, NX_AOC_URL), { headers });
    return checkStatus(response);
  } catch (error) {
    console.error(error);

    const errorBody = await error.response.text();
    console.error(`Error body: ${errorBody}`);
    return Promise.reject(errorBody);
  }
};

if (!NX_AOC_SESSION.match(/^[\da-f]*$/g)) throw new Error('Invalid NX_AOC_SESSION');

const headers = {
  cookie: `session=${NX_AOC_SESSION}`,
};

const checkStatus = (response: Response) => {
  if (response.ok) {
    return response;
  } else {
    throw new HTTPResponseError(response);
  }
};

class HTTPResponseError extends Error {
  response: Response;
  constructor(response: Response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}
