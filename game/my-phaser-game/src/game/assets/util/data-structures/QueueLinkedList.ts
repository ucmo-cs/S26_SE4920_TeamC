// make any and array of three
export class Node {
    private data : any;
    private next : Node | null;
    // set max length

    constructor(data : any){
        this.data = data;
        this.next = null;
    }

    getData(){
        return this.data;
    }

    getNext(){
        return this.next;
    }
    setNext(node : Node){
        this.next = node;
    }

    toString(): string {
        return String(this.data);
    }
}


// TO DO Make async queue to wait for next item
export class QueueLinkedList{
    private front : any;
    private rear: any;

    constructor(){
        this.front = this.rear = null;
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
            this.rear.next = null;
        }
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

        return removedData;
    }

    size() : number {
        let currentSize : integer = 1;
        if(this.front === null){
            return 0;
        }

        let currentNode = this.front.next;
        while(currentNode !== null){
            currentNode = currentNode.next;
            currentSize++;
        }

        return currentSize;
    }

    // returns true if is === null
    isEmpty(){
        return this.front === null;
    }

    toString() : String {
        let output : String = "Queue: " ;

        if(this.front === null)
            return output;

        let currentNode = this.front;
        while(currentNode !== null){
            output += "\n" + currentNode.toString();
            currentNode = currentNode.next;
        }

        return output;
    }
}