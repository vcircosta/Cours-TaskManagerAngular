import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Tasks } from '../interfaces/tasks';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  private tasksSignal = signal<Tasks[]>(this.loadFromLocalStorage());

  readonly allTasks = this.tasksSignal.asReadonly();

  private loadFromLocalStorage(): Tasks[] {
    const data = localStorage.getItem('tasks_storage');
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(tasks: Tasks[]): void {
    localStorage.setItem('tasks_storage', JSON.stringify(tasks));
  }

  getTaskById(id: number): Observable<Tasks> {
  return this.httpClient.get<Tasks>(`${this.apiUrl}/${id}`);
  }

  getAllTask(): Observable<Tasks[]> {
    return this.httpClient.get<Tasks[]>(this.apiUrl).pipe(
      tap((tasks) => {
        this.tasksSignal.set(tasks);
        this.saveToLocalStorage(tasks);
      })
    );
  }

  createTask(task: Tasks): Observable<Tasks> {
    return this.httpClient.post<Tasks>(this.apiUrl, task).pipe(
      tap((newTask) => {
        this.tasksSignal.update((tasks) => [...tasks, newTask]);
        this.saveToLocalStorage(this.tasksSignal());
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
        this.saveToLocalStorage(this.tasksSignal());
      })
    );
  }

  updateTask(id: number, task: Partial<Tasks>): Observable<Tasks> {
    return this.httpClient.patch<Tasks>(`${this.apiUrl}/${id}`, task).pipe(
      tap((updatedTask) => {
        this.tasksSignal.update((tasks) =>
          tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t))
        );
        this.saveToLocalStorage(this.tasksSignal());
      })
    );
  }
}
