export interface Message {
  channel: string;
  type: string;
  content?: any;
}

export type HandlerFunction = (message: Message, ...args: any[]) => void;

export type Constructor = { new (...args: any[]): {} };

export interface DescriptorWithType extends PropertyDescriptor {
  type?: string;
}

export interface TypeOptionsObject {
  type: string;
  middleware?: HandlerFunction[];
}

export type TypeOptions = string | TypeOptionsObject;

export interface Controller {
  channel: string;
  handlers: string[];
  middleware: HandlerFunction[];
  typeMiddleware: HandlerFunction[];
}

export interface Handler {
  controller: Controller;
  key: string;
  name: string;
}
