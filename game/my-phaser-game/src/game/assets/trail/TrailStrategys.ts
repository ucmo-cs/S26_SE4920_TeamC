import { Strategy } from "./Strategy";
import {HazardQueue} from "./Trail";


// concrete trail strategy
export class CreateHazardOnTrail implements Strategy {
    doOperation(): void {
        let newHazard: string[] = [];

        // for first hazard
        if(HazardQueue.isEmpty()){
            // same start each time
            newHazard = [" D ", " S ", " D "];
            HazardQueue.enqueue(newHazard);
            return;
        }

        let currentRear = HazardQueue.getRear().data;
        // hazard all danger up till this point
        // safe starting point
        let safeIndex = Math.floor(Math.random() * 3);
        currentRear[safeIndex] = " S ";

        // change path to allow safe path on current and new hazard
        // always goes down one
        const randomPercentage = Math.random();
        switch(safeIndex){
            case 0: // previous looks like this [ " S ", " D ", " D "]
                // previous [ " S ", " D ", " D "]
                // next hazard can be any of these options
                // can go one or two rights then down from there
                newHazard = Math.random() < randomPercentage ? [" S ", " S ", " D "] : [" S ", " S ", " S "];
                // make just the path below safe
                newHazard = Math.random() < randomPercentage ? [" S ", " D ", " D "] : newHazard;
                break;
            case 1: // previous looks like this [ " D ", " S ", " D "]
                // previous [ " D ", " S ", " D "]
                // next hazard can be any of these options
                // can go left right and then down from there
                newHazard = Math.random() < randomPercentage ? [" S ", " S ", " D "] : [" D ", " S ", " S "];
                // make just the path below safe
                newHazard = Math.random() < randomPercentage ? [" D ", " S ", " D "] : newHazard;

                break;
            case 2: // previous looks like this [ " D ", " D ", " S "]
                // previous [ " D ", " D ", " S "]
                // next hazard can be any of these options
                // can go one or two lefts then down from there
                newHazard = Math.random() < randomPercentage ? [" D ", " S ", " S "] : [" S ", " S ", " S "];
                // make just the path below safe
                newHazard = Math.random() < randomPercentage ? [" D ", " D ", " S "] : newHazard;
                break;
            default:
        }

        HazardQueue.enqueue(newHazard);
    }
}

export class AdvanceHazards implements Strategy {
    doOperation(): void {
        HazardQueue.dequeue();
    }
}