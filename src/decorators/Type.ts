import { DescriptorWithType, TypeOptions } from '../interfaces';
import { Utils } from '../utils';

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
