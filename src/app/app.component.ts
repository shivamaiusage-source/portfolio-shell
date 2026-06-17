import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AiChatComponent } from './components/ai-chat/ai-chat.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AiChatComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private router    = inject(Router);
  private seoService = inject(SeoService);

  isSubProject = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: any) => {
        const url = e.urlAfterRedirects;
        return url.startsWith('/freeflix') ||
               url.startsWith('/rag') ||
               url.startsWith('/monitoring');
      })
    ),
    { initialValue: false }
  );

  ngOnInit() {
    this.seoService.init();
  }
}
