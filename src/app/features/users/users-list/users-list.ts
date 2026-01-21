import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UsersService} from '../users-service';
import {User} from '../../../core/auth/interfaces/user';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.html'
})
export class UsersList implements OnInit {
  private usersService: UsersService = inject(UsersService);
  
  users: WritableSignal<User[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.usersService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Erreur lors du chargement des utilisateurs');
        this.isLoading.set(false);
        console.error('Erreur:', error);
      }
    });
  }

  banUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir bannir l'utilisateur "${user.username}" ?`)) {
      const currentUsers = this.users();
      const updatedUsers = currentUsers.filter(u => u.id !== user.id);
      this.users.set(updatedUsers);
      
      alert(`L'utilisateur "${user.username}" a été banni avec succès.`);
    }
  }
}