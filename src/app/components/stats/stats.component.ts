import { Component } from '@angular/core';
@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  stats = [
    { value: '3+',  label: 'years_experience' },
    { value: '4',   label: 'live_projects'    },
    { value: '2',   label: 'companies'        },
    { value: 'v19', label: 'angular_experience_upto'  },
  ];
}
