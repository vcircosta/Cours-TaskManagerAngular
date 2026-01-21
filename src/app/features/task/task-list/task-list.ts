import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/taskService';
import { Status, Tasks } from '../interfaces/tasks';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskStatusPipe } from '../pipe/task-status-pipe';
import { DatePipe } from '@angular/common';

type TaskFilter = 'ALL' | 'TODO' | 'DONE';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink, TaskStatusPipe, DatePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private destroyRef = inject(DestroyRef);

  tasks = signal<Tasks[]>([]);
  
  currentFilter = signal<TaskFilter>('ALL');

  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const filter = this.currentFilter();

    switch (filter) {
      case 'TODO':
        return allTasks.filter(t => t.status !== Status.DONE);
      case 'DONE':
        return allTasks.filter(t => t.status === Status.DONE);
      default:
        return allTasks;
    }
  });

  ngOnInit() {
    this.getTasks();
  }

  changeFilter(newFilter: TaskFilter) {
    this.currentFilter.set(newFilter);
  }

  getTasks() {
    this.taskService.getAllTask()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => this.tasks.set(tasks),
        error: () => console.error('Erreur de chargement')
      });
  }

  onDeleteTask(task: Tasks) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
      if (task.id) {
        this.taskService.deleteTask(task.id).subscribe(() => this.getTasks());
      }
    }
  }

  startTask(task: Tasks) {
    if (task.id === undefined) return; 

    this.taskService.updateTask(task.id, { 
      ...task, 
      status: Status.IN_PROGRESS, 
      updatedAt: new Date().toISOString()
    }).subscribe(() => this.getTasks());
  }

  markAsDone(task: Tasks) {
    if (task.id !== undefined) {
      this.taskService.updateTask(task.id, { 
        ...task, 
        status: Status.DONE, 
        updatedAt: new Date().toISOString()
      }).subscribe(() => this.getTasks());
    }
  }

  getStatusColor(status: Status | undefined) {
    switch (status) {
      case Status.PENDING: return 'bg-red-100 text-red-800';
      case Status.IN_PROGRESS: return 'bg-amber-100 text-amber-800';
      case Status.DONE: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}