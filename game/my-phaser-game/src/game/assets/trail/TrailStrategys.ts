import { LEFT, RIGHT } from "phaser";
import { Strategy } from "./Strategy";
import {HazardQueue, moves} from "./Trail";

// concrete trail strategy
export class CreateHazardOnTrail implements Strategy {
    doOperation(): void {
        // always danger till overwrites one of the indexes based on previous safe index of rear
        let newHazard: string[] = [" D ", " D ", " D "];

        // for first hazard
        if(HazardQueue.isEmpty()){
            // same start each time
            newHazard = [" D ", " S ", " D "];
            // start of the safe path. Creates more safe traversal for next enqueue further down the code.
            moves.pathHead = 1;
            HazardQueue.enqueue(newHazard);
            return;
        }

        const rearData : string[] = HazardQueue.getRear().data;
        // get rear
        // chose to go left or right or none when at index 1
        // based on that go down on current index position

        // randomly choose to go left, right, or stay the same
        // check if safe else do other random choice until safe

        // choices random path
        const options : string[] = ["LEFT", "RIGHT", "NONE"];
        console.log(moves.previousMove);

        // have left right be sl
        let choice =  options[Math.floor(Math.random() * options.length)];

        while(choice === moves.previousMove){
            choice =  options[Math.floor(Math.random() * options.length)];
        }

        moves.previousMove = choice;

        // make it so  it dose not choice same option twice in a row

        // falls through if choice is invalid.
        switch(choice){
            case "LEFT":
                if(moves.pathHead - 1 >= 0){
                    moves.pathHead = moves.pathHead - 1;
                    rearData[moves.pathHead] = " S ";
                    break;
                }

            case "RIGHT":
                if(moves.pathHead + 1 < rearData.length){
                    moves.pathHead = moves.pathHead + 1;
                    rearData[moves.pathHead] = " S ";
                    break;
                }

            // also NONE option.
            default:
                break;
        }

        newHazard[moves.pathHead] = " S ";
        HazardQueue.enqueue(newHazard);
    }
}

export class AdvanceHazards implements Strategy {
    doOperation(): void {
        HazardQueue.dequeue();
    }
}