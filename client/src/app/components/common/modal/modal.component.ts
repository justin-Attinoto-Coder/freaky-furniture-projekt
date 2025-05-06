import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ModalComponent {
  @Input({ required: true }) isOpen!: boolean;
  @Output() close = new EventEmitter<void>();
}
