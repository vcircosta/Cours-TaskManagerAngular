import {Component, inject, Input, input, output} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth-service';
import {Comments} from '../interfaces/comments';

@Component({
    selector: 'app-comment-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './comments-list.html',
    styleUrl: './comments-list.css'
})
export class CommentsList {

    @Input() comments: Comments[] = [];
}
