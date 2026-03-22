
export class Node {
    private data : any;
    private next : Node | null;

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

}