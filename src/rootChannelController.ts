import { Message, HandlerFunction, Controller, Handler } from './interfaces';
import { Utils } from './utils';

export default class RootChannelController {
  private handlers: Map<string, Handler[]>;
  private middleware: Map<string, HandlerFunction[]>;

  constructor() {
    this.handlers = new Map();
    this.middleware = new Map();
  }

  public addControllers(controllers: any[] | any): void {
    if (controllers.forEach) {
      controllers.forEach((controller: any) => {
        this.addController(controller);
      });
    } else {
      this.addController(controllers);
    }
  }

  private addController(controller: Controller): void {
    this.addHandlersToRootController(controller);
    this.addChannelMiddlewareToAllChildHandlers(controller);
    this.addMiddlewareToHandlers(controller);
  }

  private addHandlersToRootController(controller: Controller): void {
    if (!controller.handlers) return;
    controller.handlers.forEach((handlerSet: any) => {
      const type: string = handlerSet[0];
      const functionName: string = handlerSet[1];
      const key: string = Utils.buildHandlerKey(controller.channel, type);
      const handler: Handler = { controller, name: functionName, key };
      const existingValue: Handler[] | undefined = this.handlers.get(key);
      if (existingValue) {
        existingValue.push(handler);
      } else {
        this.handlers.set(key, [handler]);
      }
    });
  }

  private addChannelMiddlewareToAllChildHandlers(controller: Controller): void {
    if (!controller.middleware) return;
    this.handlers.forEach((value: Handler[], key: string): void => {
      const existingValue = this.middleware.get(key);
      if (existingValue) {
        console.log(controller.middleware, existingValue);
        this.middleware.set(key, [...controller.middleware, ...existingValue]);
      } else {
        console.log(controller.middleware.toString());
        this.middleware.set(key, controller.middleware);
      }
    });
  }

  private addMiddlewareToHandlers(controller: Controller): void {
    if (!controller.typeMiddleware) return;
    controller.typeMiddleware.forEach((middlewareSet: any) => {
      const type = middlewareSet[0];
      const middleware = middlewareSet[1];
      const key = Utils.buildHandlerKey(controller.channel, type);
      const existingValue = this.middleware.get(key);
      if (existingValue) {
        this.middleware.set(key, [...middleware, ...existingValue]);
      } else {
        this.middleware.set(key, middleware);
      }
    });
  }

  public handle(message: Message, ...args: any[]): void {
    const { channel, type } = message;
    const key = Utils.buildHandlerKey(channel, type);
    this.applyMiddleware(key, message, ...args);
    this.performHandlers(key, message, ...args);
  }

  private applyMiddleware(key: string, message: Message, ...args: any[]): void {
    const middleware = this.middleware.get(key);
    if (middleware) {
      middleware.forEach((middlewareFn: HandlerFunction) => {
        middlewareFn(message, ...args);
      });
    }
  }

  private performHandlers(key: string, message: Message, ...args: any[]): void {
    const handlers = this.handlers.get(key);
    if (handlers) {
      handlers.forEach((handler: Handler) => {
        (handler.controller as any)[handler.name](message, ...args);
      });
    }
  }
}
