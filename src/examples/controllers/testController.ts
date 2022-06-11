import {
  ChannelController,
  Type,
  ChannelMiddleware
} from '../../decorators/ChannelController';
import { Message } from '../../interfaces';

@ChannelController('test')
@ChannelMiddleware([
  (message): void => {
    message.content = 'I changed the content';
  }
])
@ChannelMiddleware([
  (message): void => {
    message.content = 'I changed the content again';
  }
])
export class TestController {
  @Type('test_event')
  public doSomething(message: Message): void {
    console.log('Handling', message);
  }

  @Type('test_event2')
  public doSomethingElse(message: Message): void {
    console.log('Handling for sure', message);
  }
}
