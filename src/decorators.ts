import {
  HandlerFunction,
  TypeOptions,
  Constructor,
  DescriptorWithType
} from './interfaces';

/**
 *
 * Marks a class as a Doeet controller for the given channel
 *
 * NOTE: Multiple controllers can be registered to the same channel
 *
 * @example Simple controller that has one type handler
 * ```ts
 * @ChannelController('my-channel')
 * class MyChannelController {
 *    @Type('my-type')
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
            [...this.middleware, ...newMiddleware]
          : newMiddleware;
    };
  };
};

export const Type = (options: TypeOptions): MethodDecorator => {
  return (
    controller: any,
    name: PropertyKey,
    descriptor: DescriptorWithType
  ): void => {
    const type = typeof options === 'string' ? options : options.type;
    descriptor.type = type;
    if (!controller.handlers) {
      controller.handlers = [];
    }
    controller.handlers.push([type, name]);
    if (typeof options !== 'string' && options.middleware) {
      if (!controller.typeMiddleware) {
        controller.typeMiddleware = [];
      }
      options.middleware.forEach((middlewareFn: HandlerFunction) => {
        controller.typeMiddleware.push([type, middlewareFn]);
      });
    }
  };
};
