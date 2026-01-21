import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth-service';

@Component({
    selector: 'app-comment-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './comments-list.html',
    styleUrl: './comments-list.css'
})
export class CommentsList {

    comments = input.required<Comment[]>();

}
