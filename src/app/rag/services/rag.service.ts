import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface Source {
  excerpt: number;
  content: string;
  similarity: number;
  page: number;
}

@Injectable({ providedIn: 'root' })
export class RagService {

  private apiUrl = environment.apiUrl + '/rag';

  // Session ID — generated once per browser session
  private sessionId: string;

  // Signals
  pdfMessages = signal<ChatMessage[]>([]);
  portfolioMessages = signal<ChatMessage[]>([]);
  uploadedDocs = signal<any[]>([]);
  isLoading = signal(false);

  constructor(private http: HttpClient) {
    // Get or create session ID
    this.sessionId = localStorage.getItem('rag_session_id') || uuidv4();
    localStorage.setItem('rag_session_id', this.sessionId);
  }

  getSessionId(): string { return this.sessionId; }

  // Upload PDF
  uploadPdf(file: File) {
    const formData = new FormData();
    formData.append('pdf', file);

    const headers = new HttpHeaders({ 'session-id': this.sessionId });
    return this.http.post<any>(`${this.apiUrl}/upload`, formData, { headers });
  }

  // PDF Chat
  askPdf(question: string) {
    return this.http.post<any>(`${this.apiUrl}/chat`, {
      question,
      sessionId: this.sessionId
    });
  }

  // Portfolio Chat
  askPortfolio(question: string) {
    return this.http.post<any>(`${this.apiUrl}/portfolio`, { question });
  }

  // Get documents
  getDocuments() {
    const headers = new HttpHeaders({ 'session-id': this.sessionId });
    return this.http.get<any>(`${this.apiUrl}/documents`, { headers });
  }

  // Add message to PDF chat
  addPdfMessage(msg: ChatMessage) {
    this.pdfMessages.update(msgs => [...msgs, msg]);
  }

  // Add message to portfolio chat
  addPortfolioMessage(msg: ChatMessage) {
    this.portfolioMessages.update(msgs => [...msgs, msg]);
  }
}
