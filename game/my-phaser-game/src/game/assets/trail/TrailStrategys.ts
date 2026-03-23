import { Strategy } from "./Strategy";
import {HazardQueue} from "./Trail";

// concrete trail strategy
export class CreateHazardOnTrail implements Strategy {
    doOperation(): void {
        // TODO change from letters to Hazard class type.
        // Implement hazard logic and use factory creation design pattern to spawn them here.
        let newHazard: string[] = [Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ", Math.random() < 0.5 ? " D " : " S ",];

        // for first hazard
        if(HazardQueue.isEmpty()){
            // same start each time
            newHazard = [" S ", " S ", " S "];
            HazardQueue.enqueue(newHazard);
            console.log("ran is empty");
            return;
        }

        // let index = HazardQueue.getFront();
        // let previousHazard : any[] = index.getData();
        // while(index.getNext() !== null){
        //     previousHazard = index.data();
        //     index = index.getNext();
        // }

        // console.log("previousHazard " + previousHazard);

        // const safeIndexes : any[] = [];

        // // finds safe indexes of previousHazard array
        // for(let index = 0; index < previousHazard.length; index++){
        //     if(previousHazard[index] === " S ")
        //         safeIndexes.push(index);
        // }

        // // checks new hazard array to make sure it is not impossible to pass
        // for (let index = 0; index < newHazard.length; index++) {
        //     // checks to see if there is at least one safe path
        //     if(previousHazard[index] === " S " && newHazard[index] === " S ")
        //         break;

        //     // updates random index in newHazard to allow at least one safe path forward
        //     if(index === newHazard.length - 1){
        //         const randomIndex = Math.floor(Math.random() * safeIndexes.length);
        //         console.log("new safe index " + randomIndex);
        //         newHazard[randomIndex] = " S ";
        //     }
        // }
        HazardQueue.enqueue(newHazard);
    }
}

export class AdvanceHazards implements Strategy {
    doOperation(): void {
        HazardQueue.dequeue();
    }
}