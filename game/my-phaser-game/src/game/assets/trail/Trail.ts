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

// singleton. Can be accessed everywhere and is the same queue
export const HazardQueue = new QueueLinkedList();