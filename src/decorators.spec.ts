import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { ChannelController, ChannelMiddleware, Type } from './decorators';
import { Utils } from './utils';

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
    const fn = (): void => {};
    (instance as any).addMiddleware([fn]);
    expect(instance.middleware).to.deep.equal([fn]);

    const fn2 = (): void => {
      console.log();
    };
    (instance as any).addMiddleware([fn2]);
    expect(instance.middleware).to.deep.equal([fn, fn2]);
  });
});

describe('ChannelMiddleware', () => {
  it('should add middleware to the class', () => {
    const channel = 'test-channel';
    const fn = (): void => {};
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
    const fn = (): void => {};
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

describe('Type', () => {
  const sandbox = createSandbox();

  let addTypeMiddlewareStub: SinonStub;

  beforeEach(() => {
    addTypeMiddlewareStub = sandbox.stub(Utils, 'addTypeMiddleware');
  });

  afterEach(() => {
    sandbox.restore();
  });
  it('should register a handler for the provided string type', () => {
    const type = 'test-type';
    const handlerFnName = 'testHandler';
    @ChannelController('test')
    class Controller {
      @Type(type)
      [handlerFnName](): void {
        console.log();
      }
    }

    const instance = new Controller();
    expect((instance as any).handlers).to.deep.equal([[type, handlerFnName]]);
  });

  it('should register a multiple handlers for the provided string type', () => {
    const type = 'test-type';
    const handlerFnName = 'testHandler';
    const type2 = 'test-type2';
    const handlerFnName2 = 'testHandler2';
    @ChannelController('test')
    class Controller {
      @Type(type)
      [handlerFnName](): void {
        return;
      }

      @Type(type2)
      [handlerFnName2](): void {
        return;
      }
    }

    const instance = new Controller();
    expect((instance as any).handlers).to.deep.equal([
      [type, handlerFnName],
      [type2, handlerFnName2]
    ]);
  });

  it('should register a handler with options', () => {});
});
