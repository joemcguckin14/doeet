import {
  HandlerFunction,
  TypeOptions,
  Constructor,
  DescriptorWithType
} from './interfaces';
import { Utils } from './utils';

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

/**
 * kdslafjass;ldjfa;
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

/**
 * Marks a function as a handler for the given type
 *
 * @param type
 * @param options @{link TypeOptions}
 * @returns
 */
export const Type = (type: string, options?: TypeOptions): MethodDecorator => {
  return (
    controller: any,
    name: PropertyKey,
    descriptor: DescriptorWithType
  ): void => {
    descriptor.type = type;
    if (!controller.handlers) {
      controller.handlers = [];
    }
    controller.handlers.push([type, name]);
    Utils.addTypeMiddleware(controller, type, options?.middleware);
  };
};
