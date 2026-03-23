import { Strategy } from "./Strategy";
import {HazardQueue} from "./Trail";

// concrete trail strategy
export class CreateHazardOnTrail implements Strategy {
    doOperation(): void {
        // remove. Just for testing
        const hazardStatus: string[] = [Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ",];
        // add an array for each "hazard"
        // check previous array in list to make sure it is not impossible for player to traverse
        HazardQueue.enqueue(hazardStatus);
    }
}

export class AdvanceHazards implements Strategy {
    doOperation(): void {
        HazardQueue.dequeue();
    }
}