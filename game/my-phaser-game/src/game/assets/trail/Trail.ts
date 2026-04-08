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
export const moves = {
    // when using for hazard array tracking this is the index in the node.data array that is the current step in the path.
    pathHead: -1,

    // in order to prevent repeat moves
    previousMove: "NONE",
}