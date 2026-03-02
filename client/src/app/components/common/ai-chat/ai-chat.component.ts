import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRobot, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { AiService } from '../../../services/ai.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent implements OnInit {
  isOpen = false;
  isLoggedIn = false;
  userMessage = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  faRobot = faRobot;
  faTimes = faTimes;
  faPaperPlane = faPaperPlane;

  constructor(
    private authService: AuthService,
    private aiService: AiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.token$.subscribe(token => {
      this.isLoggedIn = !!token;
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  goToLogin(): void {
    this.isOpen = false;
    this.router.navigate(['/login'], { queryParams: { from: '/home' } });
  }

  sendMessage(): void {
    const text = this.userMessage.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', text });
    this.userMessage = '';
    this.isLoading = true;

    this.aiService.chat(text).subscribe({
      next: response => {
        this.messages.push({ role: 'assistant', text: response.reply });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({ role: 'assistant', text: 'Sorry, I could not process your request. Please try again.' });
        this.isLoading = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
