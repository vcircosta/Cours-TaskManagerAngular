import { Tasks } from '../../task/interfaces/tasks';

export interface Comments extends Tasks {
    taskId: number;
    message: string;
    date: string;
}
