import { Strategy } from './Strategy';
import { HazardQueue, moves } from './Trail';

export class CreateHazardOnTrail implements Strategy {
  doOperation(): void {
    const newHazard = [' D ', ' D ', ' D '];

    if (HazardQueue.isEmpty()) {
      const startingHazard = [' D ', ' S ', ' D '];
      moves.pathHead = 1;
      HazardQueue.enqueue(startingHazard);
      return;
    }

    const options = ['LEFT', 'RIGHT', 'NONE'] as const;
    const choice = options[Math.floor(Math.random() * options.length)];

    switch (choice) {
      case 'LEFT':
        if (moves.pathHead - 1 >= 0) {
          moves.pathHead -= 1;
        }
        break;
      case 'RIGHT':
        if (moves.pathHead + 1 < newHazard.length) {
          moves.pathHead += 1;
        }
        break;
      default:
        break;
    }

    newHazard[moves.pathHead] = ' S ';
    HazardQueue.enqueue(newHazard);
  }
}
