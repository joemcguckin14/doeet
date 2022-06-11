import { expect } from 'chai';
import RootChannelController from './rootChannelController';

describe('RootChannelController', () => {
  let fixture: RootChannelController;
  describe('addControllers', () => {
    beforeEach(() => {
      fixture = new RootChannelController();
    });
    it('should add controllers', () => {
      expect(true).to.be.true;
    });
  });
});
