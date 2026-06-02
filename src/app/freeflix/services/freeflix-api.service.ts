import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FreelixApiService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Videos
  getVideos(search?: string, genre?: string) {
    let url = `${this.apiUrl}/videos`;
    const params: any = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    return this.http.get<any>(url, { params });
  }

  getVideoById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/videos/${id}`);
  }

  // Watch history
  saveHistory(video_id: number, progress_seconds: number) {
    return this.http.post(`${this.apiUrl}/history`, { video_id, progress_seconds });
  }

  getHistory() {
    return this.http.get<any>(`${this.apiUrl}/history`);
  }

  // Ratings
  rateVideo(video_id: number, stars: number) {
    return this.http.post(`${this.apiUrl}/ratings`, { video_id, stars });
  }

  getVideoRating(videoId: number) {
    return this.http.get<any>(`${this.apiUrl}/ratings/${videoId}`);
  }

  // My List
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
