export const buildHandlerKey = (channel: string, type: string): string => {
  return [channel, type].join('.');
};
