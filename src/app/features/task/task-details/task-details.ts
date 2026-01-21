import {Component, DestroyRef, inject, Input, OnInit, signal} from '@angular/core';
import {TaskService} from '../services/taskService';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Status, Tasks} from '../interfaces/tasks';
import {TaskStatusPipe} from '../pipe/task-status-pipe';

@Component({
    selector: 'app-task-details',
    imports: [
        TaskStatusPipe
    ],
    templateUrl: './task-details.html',
    styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {
    @Input() id!: number;
    private taskService: TaskService = inject(TaskService);
    private destroyRef = inject(DestroyRef);

    currentTask = signal<Tasks | null>(null);

    ngOnInit() {
        this.getCurrentTask();
    }

    getCurrentTask () {
        this.taskService.getTaskById(this.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (task: Tasks) => this.currentTask.set(task),
                error: () => console.log('error')
            })
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
