import {Component, EventEmitter, inject, Input, input, Output, output, Signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth-service';
import { Comments } from '../interfaces/comments';
import { Tasks } from '../../task/interfaces/tasks';

@Component({
    selector: 'app-comment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './comments-form.html',
    styleUrl: './comments-form.css'
})
export class CommentsForm {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    @Input() task!: Tasks;
    @Output() commentCreated = new EventEmitter<Comments>();

    commentForm: FormGroup = this.fb.group({
        message: ['', [Validators.required, Validators.minLength(1)]]
    });

    onSubmit() {
        if (this.commentForm.invalid) return;

        const currentUser = this.authService.currentUser();
        if (!currentUser) return;

        const newComment: Comments = {
            id: 0,
            author: currentUser,
            taskId: this.task.id || 0,
            message: this.commentForm.value.message,
            date: new Date().toDateString()
        };

        this.commentCreated.emit(newComment);
        this.resetForm();
    }

    resetForm() {
        this.commentForm.reset();
        this.commentForm.markAsUntouched();
    }
}
