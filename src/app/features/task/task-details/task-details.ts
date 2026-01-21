import {Component, inject, Input, signal} from '@angular/core';
import {TaskService} from '../services/taskService';

@Component({
    selector: 'app-task-details',
    imports: [],
    templateUrl: './task-details.html',
    styleUrl: './task-details.css',
})
export class TaskDetails {
    @Input() id!: number;

    private taskService: TaskService = inject(TaskService);

    currentTask = signal(this.taskService.getTaskById(this.id));
}
