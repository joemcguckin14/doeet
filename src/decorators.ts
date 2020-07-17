import {
  HandlerFunction,
  TypeOptions,
  Constructor,
  DescriptorWithType
} from './interfaces';

export const ChannelController = (channel: string) => {
  return <T extends Constructor>(constructor: T): T => {
    return class extends constructor {
      channel: string = channel;
    };
  };
};

export const ChannelMiddleware = (newMiddleware: HandlerFunction[]) => {
  return <T extends Constructor>(constructor: T): T => {
    return class extends constructor {
      // @ts-ignore: This prop could exist from doubling annotations
      middleware: HandlerFunction[] = this.middleware
        ? // @ts-ignore: This prop could exist from doubling annotations
          // @ts-ignore: This prop could exist from doubling annotations
          [...newMiddleware, ...this.middleware]
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
