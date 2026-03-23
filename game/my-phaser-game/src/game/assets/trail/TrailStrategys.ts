import { Strategy } from "./Strategy";
import {HazardQueue} from "./Trail";

// concrete trail strategy
export class CreateHazardOnTrail implements Strategy {
    doOperation(): void {
        let newHazard: string[] = [" S ", " S ", " S "];

        // for first hazard
        if(HazardQueue.isEmpty()){
            // same start each time
            newHazard = [" S ", " S ", " S "];
            HazardQueue.enqueue(newHazard);
            //console.log("ran isEmpty");
            return;
        }

        // this is the problem
        const currentRear = HazardQueue.getRear().data;
        const safeIndexInRear : any[] = [];

        // check safe indexes at rear
        for (let index = 0; index < currentRear.length; index++) {
            if(currentRear[index] === " S ")
                safeIndexInRear.push(index);
        }

        // TODO change from letters to Hazard class type.
        // Implement hazard logic and use factory creation design pattern to spawn them here.
        newHazard = [Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ",];
        let index = 0;

        while(currentRear[index] !== " S " || newHazard[index] !== " S "){
            //console.log("currentRear " + currentRear);

            newHazard = [Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ",];
            //console.log("newHazard " + newHazard);
            index++;

            if(index > 2){
                index = 0;
            }
        }
        //console.log("newHazardEND " + newHazard);

        HazardQueue.enqueue(newHazard);
    }
}

export class AdvanceHazards implements Strategy {
    doOperation(): void {
        HazardQueue.dequeue();
    }
}