import { QueueLinkedList } from '../util/data-structures/QueueLinkedList';
import { Strategy } from './Strategy';

export class TrailContext {
  constructor(private strategy: Strategy) {}

  executeStrategy(): void {
    this.strategy.doOperation();
  }
}

export const HazardQueue = new QueueLinkedList<string[]>();

export const moves = {
  pathHead: -1
};
