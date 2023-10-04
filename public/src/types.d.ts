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
