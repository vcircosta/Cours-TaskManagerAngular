import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task/services/taskService';
import { AuthService } from '../../core/auth/services/auth-service';
import { Status, Tasks } from '../task/interfaces/tasks';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private taskService = inject(TaskService);
  protected authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  tasks = signal<Tasks[]>([]);

  totalTasks = computed(() => this.tasks().length);

  myTasks = computed(() => {
    const currentUser = this.authService.currentUser();
    return this.tasks().filter(task => task.user?.id === currentUser?.sub).length;
  });

  completedTasks = computed(() =>
    this.tasks().filter(task => task.status === Status.DONE).length
  );

  todoTasks = computed(() =>
    this.tasks().filter(task => task.status === Status.PENDING).length
  );

  inProgressTasks = computed(() =>
    this.tasks().filter(task => task.status === Status.IN_PROGRESS).length
  );

  myActiveTasks = computed(() => {
    const currentUser = this.authService.currentUser();
    return this.tasks().filter(task =>
      task.user?.id === currentUser?.sub &&
      task.status !== Status.DONE
    ).length;
  });

  completionPercentage = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.completedTasks() / total) * 100);
  });


  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getAllTask()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks: Tasks[]) => {
          this.tasks.set(tasks);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tâches:', err);
        }
      });
  }

  isAdmin(): boolean {
    return this.authService.currentUser()?.role === 'ADMIN';
  }
}
