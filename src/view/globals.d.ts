/// <reference types="svelte" />

export type PostMessageTypes =
  | "onOpen"
  | "onSidebarClose"
  | "onInfo"
  | "onError";

export interface PostMessageOptions {
  type: PostMessageTypes;
  value?: unknown;
}

declare global {
  const tsvscode: {
    postMessage: (options: PostMessageOptions) => void;
  };
}

declare module "*.svelte";
