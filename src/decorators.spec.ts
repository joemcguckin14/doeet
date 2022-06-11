import { expect } from 'chai';
import { ChannelController } from './decorators';

describe('ChannelController', () => {
  it('should add channel to a class when annotated', () => {
    const channel = 'test-channel';

    @ChannelController(channel)
    class TestController {}

    expect((new TestController() as any).channel).to.equal(channel);
  });

  it('should add channel to a class when annotated with overriden constructor', () => {
    const channel = 'test-channel';
    const val = 'some-value';

    @ChannelController(channel)
    class TestController {
      constructor(private someValue: string) {}
    }

    const instance = new TestController(val) as any;
    expect(instance.channel).to.equal(channel);
    expect(instance.someValue).to.equal(val);
  });

  it('should add addMiddleware fn to class', () => {
    const channel = 'test-channel';

    @ChannelController(channel)
    class TestController {}

    const instance = new TestController() as any;
    expect(instance.middleware).to.deep.equal([]);
    const fn = () => {};
    (instance as any).addMiddleware([fn]);
    expect(instance.middleware).to.deep.equal([fn]);

    const fn2 = () => {
      console.log();
    };
    (instance as any).addMiddleware([fn2]);
    expect(instance.middleware).to.deep.equal([fn, fn2]);
  });
});
