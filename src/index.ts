import { Message, HandlerFunction } from './interfaces';
import RootChannelController from './rootChannelController';
import { ChannelController, Type } from './decorators';

export {
  ChannelController,
  Type,
  HandlerFunction,
  Message,
  RootChannelController
};

// import { TestController } from './examples/controllers/testController';
// const r = new RootChannelController();
// r.addControllers(new TestController());
// r.handle(
//   {
//     channel: 'test',
//     type: 'test_event',
//     content: 'testttt'
//   },
//   'Another arg'
// );
