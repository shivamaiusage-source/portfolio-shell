import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MarkdownPipe } from '../../rag/shared/pipes/markdown.pipe';
import { environment } from '../../../environments/environment';
import { AiChatService } from './ai-chat.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  private http = inject(HttpClient);
  chatService = inject(AiChatService);

  isTyping = signal(false);
  question = '';
  messages = signal<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm Shivam's AI assistant 👋\n\nAsk me anything about his projects, skills, or experience!`,
      timestamp: new Date()
    }
  ]);

  suggestions = [
    'Tell me about FreeFlix',
    'What is his tech stack?',
    'Years of experience?',
    'Why hire Shivam?'
  ];

  ngAfterViewChecked() {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }

  send() {
    const q = this.question.trim();
    if (!q || this.isTyping()) return;

    this.messages.update(msgs => [...msgs, {
      role: 'user', content: q, timestamp: new Date()
    }]);

    this.question = '';
    this.isTyping.set(true);

    this.http.post<any>(`${environment.apiUrl}/rag/portfolio`, { question: q })
      .subscribe({
        next: (res) => {
          this.messages.update(msgs => [...msgs, {
            role: 'assistant', content: res.answer, timestamp: new Date()
          }]);
          this.isTyping.set(false);
        },
        error: () => {
          this.messages.update(msgs => [...msgs, {
            role: 'assistant',
            content: 'Sorry, something went wrong. Try again!',
            timestamp: new Date()
          }]);
          this.isTyping.set(false);
        }
      });
  }

  useSuggestion(s: string) {
    this.question = s;
    this.send();
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }
}
