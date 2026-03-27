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

        // make it so that you don`t create newHazards randomly and instead just check avaiable paths with path finding algorithm and just make one of the paths safe but have which ever one that is safe be random or if there is only one safe path just do that.

        // path find up until this point so n-1 of the queue
        // then each run check the next item in the queue to be added until it is safe.
        // add multiple randomly but always keep at least one on path.

        // fix this logic to have a safe random path
        // think need to use some kind of graphing algorithm to traverse Query and make sure path safe.
        // can not just check previous statement
        // use depth first search for at least one
        /// use breadth first search for each option first
        // need some kind of path finding algorithm.
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