import { Strategy } from "./Strategy";
import { HazardQueue } from "./Trail";

export class AdvanceHazards implements Strategy {
    doOperation(): void {
        HazardQueue.dequeue();
    }

}