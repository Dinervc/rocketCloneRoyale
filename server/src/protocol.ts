import type { ServerToClientMessage } from "@skyforge/shared";

export const encode = (message: ServerToClientMessage): string => JSON.stringify(message);
