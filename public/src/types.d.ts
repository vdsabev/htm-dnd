declare global {
  interface Window {
    app: {
      board: Board;
      itemBeingDragged?:
        | { type: 'lane'; item: Lane }
        | { type: 'task'; item: Task };
    };
  }
}

export interface Board {
  _id: string;
  lanes: Lane[];
}

export interface Lane {
  _id: string;
  name: string;
  tasks: Task[];
}

export interface Task {
  _id: string;
  text: string;
}
