import {User} from '../../../core/auth/interfaces/user';

export interface Comments {
    id: number;
    taskId: number;
    author: User;
    message: string;
    date: string;
}
