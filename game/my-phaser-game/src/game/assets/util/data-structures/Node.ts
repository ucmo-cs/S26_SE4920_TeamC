
export class Node {
    private data : any;
    private next : Node;

    constructor(data : any){
        this.data = data;
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

}