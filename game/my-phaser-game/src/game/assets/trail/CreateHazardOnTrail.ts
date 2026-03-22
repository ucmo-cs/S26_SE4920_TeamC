import { Strategy } from "./Strategy";
import {HazardQueue} from "./Trail";
import { Node } from "../util/data-structures/QueueLinkedList";

export class CreateHazardOnTrail implements Strategy {
    doOperation(): void {
    // add an array for each "hazard"
    // check previous array in list to make sure it is not impossible for player to traverse
     HazardQueue.enqueue(new Node("hazard"));
    }
}