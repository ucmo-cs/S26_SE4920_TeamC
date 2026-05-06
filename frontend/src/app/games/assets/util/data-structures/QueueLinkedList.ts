type NodeValue<T> = {
  data: T;
  next: NodeValue<T> | null;
};

export class QueueLinkedList<T> {
  private front: NodeValue<T> | null = null;
  private rear: NodeValue<T> | null = null;

  enqueue(data: T): void {
    const node: NodeValue<T> = { data, next: null };

    if (this.isEmpty()) {
      this.front = node;
      this.rear = node;
      return;
    }

    if (this.rear) {
      this.rear.next = node;
    }

    this.rear = node;
  }

  dequeue(): T | undefined {
    if (!this.front) {
      return undefined;
    }

    const removedData = this.front.data;
    this.front = this.front.next;

    if (!this.front) {
      this.rear = null;
    }

    return removedData;
  }

  isEmpty(): boolean {
    return this.front === null;
  }

  toArray(): T[] {
    const output: T[] = [];
    let currentNode = this.front;

    while (currentNode) {
      output.push(currentNode.data);
      currentNode = currentNode.next;
    }

    return output;
  }

  clear(): void {
    this.front = null;
    this.rear = null;
  }
}
