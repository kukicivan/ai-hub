import "@remix-run/router";

declare module "@remix-run/router" {
  export interface FutureConfig {
    v7_startTransition?: boolean;
    v7_relativeSplatPath?: boolean;
  }
}
