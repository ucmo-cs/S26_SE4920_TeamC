import { Strategy } from "./Strategy";

export class TrailContext {
    private strategy: Strategy;
// private hazardQueue = 

    constructor(strategy: Strategy){
        this.strategy = strategy;
    }

}