import { expect } from 'chai';
import { ChannelController } from './ChannelController';
import { ChannelMiddleware } from './ChannelMiddleware';

describe('ChannelMiddleware', () => {
  it('should add middleware to the class', () => {
    const channel = 'test-channel';
    const fn = (): void => {
      return;
    };
    const fn2 = (): void => {
      console.log();
    };
    @ChannelController(channel)
    @ChannelMiddleware([fn, fn2])
    class TestController {}

    const instance = new TestController() as any;
    expect(instance.middleware).to.deep.equal([fn, fn2]);
  });

  it('should allow stacking', () => {
    const channel = 'test-channel';
    const fn = (): void => {
      return;
    };
    const fn2 = (): void => {
      console.log();
    };
    @ChannelController(channel)
    @ChannelMiddleware([fn])
    @ChannelMiddleware([fn2])
    class TestController {}

    const instance = new TestController() as any;
    expect(instance.middleware).to.deep.equal([fn, fn2]);
  });
});
