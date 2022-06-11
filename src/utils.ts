import { HandlerFunction } from './interfaces';

export class Utils {
  static buildHandlerKey = (channel: string, type: string): string => {
    return [channel, type].join('.');
  };

  static addTypeMiddleware = (
    controller: any,
    type: string,
    middleware?: HandlerFunction[]
  ): void => {
    if (middleware) {
      if (!controller.typeMiddleware) {
        controller.typeMiddleware = [];
      }
      middleware.forEach((middlewareFn: HandlerFunction) => {
        controller.typeMiddleware.push([type, middlewareFn]);
      });
    }
  };
}
