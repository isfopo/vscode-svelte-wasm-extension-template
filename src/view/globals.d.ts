/// <reference types="svelte" />

export type PostMessageTypes =
  | "onOpen"
  | "onSidebarClose"
  | "onInfo"
  | "onError";

export interface PostMessageOptions {
  type: PostMessageTypes;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  value?: any;
}

declare global {
  const tsvscode: {
    postMessage: (options: PostMessageOptions) => void;
  };
}

declare module "*.svelte";
