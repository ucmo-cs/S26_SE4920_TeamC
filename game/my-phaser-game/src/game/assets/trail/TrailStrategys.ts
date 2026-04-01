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
        // // hazard all danger up till this point
        // // safe starting point
        // let safeIndex = Math.floor(Math.random() * 3);
        // // console.log("currentRear before safe index change");
        // // console.log(currentRear);

        // cant make a random safe index. Just find a safe one
        const safeIndexArray : number[] = [];
        for(let i = 0; i < currentRear.length - 1; i++){
            if(currentRear[i] === " S "){
                safeIndexArray.push(i);
                break;
            }
        }

        let randomSafeIndex = Math.floor(Math.random() * safeIndexArray.length);
        let safeIndex = safeIndexArray[randomSafeIndex];

        // let safeIndex = 2;
        // currentRear[safeIndex] = " S ";


        // change path to allow safe path on current and new hazard
        // always goes down one
        const randomPercentage = Math.random();

        // probably the order these go in that is causing an issue.
        switch(safeIndex){
            case 0: // previous looks like this [ " S ", " D ", " D "]
                // console.log(safeIndex);
                // console.log("current after safe index change");

                //console.log(currentRear);
                // previous [ " S ", " D ", " D "]
                // next hazard can be any of these options
                // can go one or two rights then down from there
                newHazard = 0.5 <= randomPercentage ? [" S ", " S ", " D ", String(safeIndex)] : [" S ", " S ", " S ", String(safeIndex)];
                // make just the path below safe
                newHazard = 0.2 <= randomPercentage ? [" S ", " D ", " D ", String(safeIndex)] : newHazard;
                // console.log("new hazard");
                // console.log(newHazard);

                break;
            case 1: // previous looks like this [ " D ", " S ", " D "]
            // console.log(safeIndex);
            // console.log("current after safe index change");

            // console.log(currentRear);
                // previous [ " D ", " S ", " D "]
                // next hazard can be any of these options
                // can go left right and then down from there
                newHazard = 0.5 <= randomPercentage ? [" S ", " S ", " D ", String(safeIndex)] : [" D ", " S ", " S ", String(safeIndex)];
                // need case for [ S, S, S]
                // make just the path below safe
                newHazard = 0.2 <= randomPercentage ? [" D ", " S ", " D ", String(safeIndex)] : newHazard;
                // console.log("new hazard");
                // console.log(newHazard);

                break;
            case 2: // previous looks like this [ " D ", " D ", " S "]
            // console.log(safeIndex);
            // console.log("current after safe index change");

            // console.log(currentRear);
                // previous [ " D ", " D ", " S "]
                // next hazard can be any of these options
                // can go one or two lefts then down from there
                newHazard = 0.5 <= randomPercentage ? [" D ", " S ", " S ", String(safeIndex)] : [" S ", " S ", " S ", String(safeIndex)];
                // make just the path below safe
                newHazard = 0.2 <= randomPercentage ? [" D ", " D ", " S ", String(safeIndex)] : newHazard;
                // console.log("new hazard");
                // console.log(newHazard);

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