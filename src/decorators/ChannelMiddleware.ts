import { Constructor, HandlerFunction } from '../interfaces';

/**
 * Adds the specified middleware to all handlers within a class
 *
 * @param newMiddleware
 * @returns
 */
export const ChannelMiddleware = (newMiddleware: HandlerFunction[]) => {
  return <T extends Constructor>(constructor: T): T => {
    return class extends constructor {
      middleware: HandlerFunction[] =
        // @ts-ignore: this.middleware is initialized if the channelcontroller annotation is used
        this.middleware && this.middleware !== []
          ? // @ts-ignore: This prop could exist from doubling annotations
            // @ts-ignore: This prop could exist from doubling annotations
            [...newMiddleware, ...this.middleware]
          : newMiddleware;
    };
  };
};
