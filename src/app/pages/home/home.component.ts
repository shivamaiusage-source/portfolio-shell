import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AiChatService } from '../../components/ai-chat/ai-chat.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroComponent, StatsComponent, ProjectsComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomePageComponent {
  constructor(private aiChat: AiChatService) {}

  openAiChat() {
    this.aiChat.open();
  }
}
