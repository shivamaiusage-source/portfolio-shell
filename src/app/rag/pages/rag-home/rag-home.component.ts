import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rag-home',
  standalone: true,
  imports: [],
  templateUrl: './rag-home.component.html',
  styleUrl: './rag-home.component.scss'
})
export class RagHomeComponent {
  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
