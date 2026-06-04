import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagService, ChatMessage } from '../../services/rag.service';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-pdf-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  templateUrl: './pdf-chat.component.html',
  styleUrl: './pdf-chat.component.scss'
})
export class PdfChatComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  rag = inject(RagService);

  question = '';
  isTyping = signal(false);
  isUploading = signal(false);
  uploadProgress = signal('');
  currentDoc = signal<any>(null);
  isDragging = signal(false);
  messages = signal<ChatMessage[]>([]);

  ngAfterViewChecked() {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }

  // Drag and drop
  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() { this.isDragging.set(false); }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file);
  }

  handleFile(file: File) {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB');
      return;
    }
    this.uploadPdf(file);
  }

  uploadPdf(file: File) {
    this.isUploading.set(true);
    this.uploadProgress.set('Reading PDF...');
    this.messages.set([]);

    this.rag.uploadPdf(file).subscribe({
      next: (res) => {
        this.isUploading.set(false);
        this.currentDoc.set(res);
        this.uploadProgress.set('');

        // Welcome message after upload
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: `✅ **${res.filename}** uploaded successfully!\n\n📄 **${res.pageCount} pages** · **${res.chunksProcessed} sections** indexed\n\nAsk me anything about this document!`,
          timestamp: new Date()
        }]);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.uploadProgress.set('');
        alert('Upload failed: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }

  send() {
    const q = this.question.trim();
    if (!q || this.isTyping() || !this.currentDoc()) return;

    this.messages.update(msgs => [...msgs, {
      role: 'user',
      content: q,
      timestamp: new Date()
    }]);

    this.question = '';
    this.isTyping.set(true);

    this.rag.askPdf(q).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: res.answer,
          sources: res.sources,
          timestamp: new Date()
        }]);
        this.isTyping.set(false);
      },
      error: () => {
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date()
        }]);
        this.isTyping.set(false);
      }
    });
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  resetDoc() {
    this.currentDoc.set(null);
    this.messages.set([]);
    this.uploadProgress.set('');
  }
}
