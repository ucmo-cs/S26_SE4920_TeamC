import { Node } from "./Node.ts"
export class QueueLinkedList{
    private front : any;
    private rear: any;
    private currentSize : integer;

    constructor(){
        this.front = this.rear = null;
        this.currentSize = 0;
    }

    getFront(){
        return this.front;
    }
    getRear(){
        return this.rear;
    }

    // add element to queue
    enqueue(data : any){
        const new_node = new Node(data);
        if(this.isEmpty()){
          this.front = this.rear = new_node;
        } else {
            this.rear.next = new_node;
            this.rear = new_node;
        }
        this.currentSize++;
    }

    // remove element from front
    dequeue(){
        if(this.isEmpty()){
            console.log("Queue Underflow");
            return -1;
        }

        const removedData = this.front.data;
        this.front = this.front.next;
        if(this.front === null)
            this.rear = null;

        this.currentSize--;
        return removedData;
    }

    size(){
        return this.currentSize;
    }

    // returns true if is === null
    isEmpty(){
        return this.front === null;
    }
}