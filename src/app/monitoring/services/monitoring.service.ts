import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

export interface MonSession {
  id: string;
  app: string;
  origin: string;
  user_agent: string;
  screen_w: number;
  screen_h: number;
  started_at: string;
  duration_ms: number;
  page_count: number;
  click_count: number;
  error_count: number;
}

export interface MonEvent {
  id: number;
  session_id: string;
  type: 'click' | 'scroll' | 'nav' | 'error' | 'dom';
  ts: number;
  x: number | null;
  y: number | null;
  target: string | null;
  value: any;
}

export interface MonStats {
  total_sessions: string;
  total_clicks: string;
  total_errors: string;
  total_navigations: string;
  avg_duration_ms: string;
  freeflix_sessions: string;
  rag_sessions: string;
  monitoring_sessions: string;
  portfolio_sessions: string;
}

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private base = environment.apiUrl + '/monitoring';

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get<MonStats>(`${this.base}/stats`);
  }

  getSessions(filters: { app?: string; errors_only?: boolean; limit?: number } = {}) {
    const params: any = { limit: filters.limit || 50 };
    if (filters.app) params['app'] = filters.app;
    if (filters.errors_only) params['errors_only'] = 'true';
    return this.http.get<{ sessions: MonSession[]; total: number }>(
      `${this.base}/sessions`, { params }
    );
  }

  getSessionDetail(id: string) {
    return this.http.get<{ session: MonSession; events: MonEvent[] }>(
      `${this.base}/sessions/${id}`
    );
  }
}
