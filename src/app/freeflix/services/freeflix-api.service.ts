import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class FreelixApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVideos(search?: string, genre?: string) {
    const params: any = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    return this.http.get<any>(`${this.apiUrl}/videos`, { params });
  }

  getVideoById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/videos/${id}`);
  }

  saveHistory(video_id: number, progress_seconds: number) {
    return this.http.post(`${this.apiUrl}/history`, { video_id, progress_seconds });
  }

  getHistory() {
    return this.http.get<any>(`${this.apiUrl}/history`);
  }

  rateVideo(video_id: number, stars: number) {
    return this.http.post(`${this.apiUrl}/ratings`, { video_id, stars });
  }

  getVideoRating(videoId: number) {
    return this.http.get<any>(`${this.apiUrl}/ratings/${videoId}`);
  }

  addToMyList(video_id: number) {
    return this.http.post(`${this.apiUrl}/mylist/${video_id}`, {});
  }

  removeFromMyList(video_id: number) {
    return this.http.delete(`${this.apiUrl}/mylist/${video_id}`);
  }

  getMyList() {
    return this.http.get<any>(`${this.apiUrl}/mylist`);
  }
}
