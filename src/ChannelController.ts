import { HandlerFunction, Constructor } from './interfaces';

/**
 *
 * Marks a class as a Doeet controller for the given channel. Multiple controllers can be registered to the same channel
 *
 * @example Simple controller that has one type handler
 * ```ts
 * @ChannelController('my-channel')
 * class MyChannelController {
 *    @Type('my-type')
 *    myTypeHandler()  {}
 * }
 * ```
 *
 */
export const ChannelController = (channel: string) => {
  return <T extends Constructor>(constructor: T): T => {
    return class extends constructor {
      channel: string = channel;
      // @ts-ignore: this.middleware could initialized by a different annotation
      middleware: HandlerFunction[] = this.middleware ?? [];
      addMiddleware = (newMiddleware: HandlerFunction[]): void => {
        this.middleware =
          this.middleware !== []
            ? [...this.middleware, ...newMiddleware]
            : newMiddleware;
      };
    };
  };
};
