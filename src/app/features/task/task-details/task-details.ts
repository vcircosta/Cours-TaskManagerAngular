import {Component, DestroyRef, inject, Input, OnInit, signal} from '@angular/core';
import {TaskService} from '../services/taskService';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Status, Tasks} from '../interfaces/tasks';
import {TaskStatusPipe} from '../pipe/task-status-pipe';
import {CommentsForm} from '../../comments/comments-form/comments-form';
import {Comments} from '../../comments/interfaces/comments';
import {AuthService} from '../../../core/auth/services/auth-service';
import {CommentsList} from '../../comments/comments-list/comments-list';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-task-details',
    standalone: true,
    imports: [
        TaskStatusPipe,
        UpperCasePipe,
        CommentsForm,
        CommentsList
    ],
    templateUrl: './task-details.html',
    styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {
    @Input() id!: number;
    private taskService: TaskService = inject(TaskService);
    private destroyRef = inject(DestroyRef);
    private authService: AuthService = inject(AuthService);

    currentTask = signal<Tasks | null>(null);
    currentUser = this.authService.currentUser();

    comments = signal<Comments[]>([]);

    ngOnInit() {
        this.getCurrentTask();
        if (this.currentUser) {
            this.comments.set([
                {
                    id: 1,
                    taskId: this.id,
                    author: this.currentUser,
                    message: 'Premier commentaire',
                    date: new Date().toDateString()
                },
                {
                    id: 2,
                    taskId: this.id,
                    author: this.currentUser,
                    message: 'Un autre commentaire',
                    date: new Date().toDateString()
                }
            ]);
        }
    }

    getCurrentTask () {
        this.taskService.getTaskById(this.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (task: Tasks) => this.currentTask.set(task),
                error: () => console.log('error')
            })
    }

    addComment(newComment: Comments) {
        const id = this.comments().length > 0
            ? Math.max(...this.comments().map(c => c.id)) + 1
            : 1;
        this.comments.update(list => [...list, { ...newComment, id }]);
    }


    getStatusColor (status: Status | undefined) {
        switch (status) {
            case Status.PENDING: return 'bg-red-100 text-red-800'
            case Status.IN_PROGRESS: return 'bg-amber-100 text-amber-800'
            case Status.DONE: return 'bg-green-100 text-green-800'
            default: return 'bg-red-100 text-red-800'
        }
    }
}
