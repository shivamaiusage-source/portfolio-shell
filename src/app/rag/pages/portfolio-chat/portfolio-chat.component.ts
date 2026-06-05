import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagService, ChatMessage } from '../../services/rag.service';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';
import { ModelStatusComponent } from '../../components/model-status/model-status.component';

@Component({
  selector: 'app-portfolio-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe, ModelStatusComponent],
  templateUrl: './portfolio-chat.component.html',
  styleUrl: './portfolio-chat.component.scss'
})
export class PortfolioChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  rag = inject(RagService);
  question = '';
  isTyping = signal(false);
  currentModel = signal('Gemini 3.1 Flash Lite');
  modelSwitched = signal(false);

  suggestions = [
    "Tell me about FreeFlix",
    "What is Shivam's tech stack?",
    "How does the HLS streaming pipeline work?",
    "Why Cloudflare R2 over AWS S3?",
    "What did Shivam build at Songdew?",
    "Tell me about the RAG system",
    "Why Angular over React?"
  ];

  ngOnInit() {
    if (this.rag.portfolioMessages().length === 0) {
      this.rag.addPortfolioMessage({
        role: 'assistant',
        content: `Hi! I'm Shivam's AI portfolio assistant 👋\n\nI can answer questions about his projects, tech stack, and experience. Try asking me anything!`,
        timestamp: new Date()
      });
    }
  }

  ngAfterViewChecked() {
    try { this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' }); } catch {}
  }

  send() {
    const q = this.question.trim();
    if (!q || this.isTyping()) return;

    this.rag.addPortfolioMessage({ role: 'user', content: q, timestamp: new Date() });
    this.question = '';
    this.isTyping.set(true);

    this.rag.askPortfolio(q).subscribe({
      next: (res) => {
        // Update model badge
        if (res.model) {
          const prev = this.currentModel();
          this.currentModel.set(res.model);
          if (res.model !== prev || res.switched) {
            this.modelSwitched.set(true);
            setTimeout(() => this.modelSwitched.set(false), 3000);
          }
        }
        this.rag.addPortfolioMessage({
          role: 'assistant',
          content: res.answer,
          timestamp: new Date()
        });
        this.isTyping.set(false);
      },
      error: () => {
        this.rag.addPortfolioMessage({
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date()
        });
        this.isTyping.set(false);
      }
    });
  }

  useSuggestion(s: string) { this.question = s; this.send(); }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
  }
}
