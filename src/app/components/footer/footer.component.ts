import { Component } from '@angular/core';
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  links = [
    { label: 'github',   href: 'https://github.com/YOUR_USERNAME' },
    { label: 'linkedin', href: 'https://linkedin.com/in/YOUR_USERNAME' },
    { label: 'resume',   href: '/assets/resume.pdf' },
    { label: 'email',    href: 'mailto:shivamsinghitwork@gmail.com' },
  ];
}
