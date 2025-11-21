import { TextEncoder } from 'util';
import fetch, { Response, Request, Headers } from 'node-fetch';
import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill';

if (typeof global !== 'undefined') {
  // Polyfill TextEncoder/TextDecoder
  if (!global.TextEncoder) global.TextEncoder = TextEncoder;
  // Polyfill fetch
  // @ts-expect-error: Node polyfill
  if (!global.fetch) global.fetch = fetch;
  // Polyfill Response, Request, Headers
  // @ts-expect-error: Node polyfill
  if (!global.Response) global.Response = Response;
  // @ts-expect-error: Node polyfill
  if (!global.Request) global.Request = Request;
  // @ts-expect-error: Node polyfill
  if (!global.Headers) global.Headers = Headers;
  // Polyfill Streams
  // @ts-expect-error: Node polyfill
  if (!global.ReadableStream) global.ReadableStream = ReadableStream;
  if (!global.WritableStream) global.WritableStream = WritableStream;
  if (!global.TransformStream) global.TransformStream = TransformStream;
  // Polyfill BroadcastChannel (dummy)
  if (!global.BroadcastChannel) {
    // @ts-expect-error: Node polyfill
    global.BroadcastChannel = class {
      constructor() {}
      postMessage() {}
      close() {}
      addEventListener() {}
      removeEventListener() {}
    };
  }
}
