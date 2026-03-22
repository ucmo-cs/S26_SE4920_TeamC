import { Strategy } from "./Strategy";
import {QueueLinkedList} from "../util/data-structures/QueueLinkedList"

export class TrailContext {
    private strategy: Strategy;

    constructor(strategy: Strategy){
        this.strategy = strategy;
    }

    executeStrategy(){
        this.strategy.doOperation();
    }
}

export const HazardQueue = new QueueLinkedList();