import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { Type } from '..';
import { Utils } from '../utils';
import { ChannelController } from './ChannelController';

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

  it('should register a handler with options', () => {
    expect(true);
  });
});
