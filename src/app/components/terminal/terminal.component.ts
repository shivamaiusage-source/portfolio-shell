import { Component, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Added 'projects' and 'skills' as line types so they render IN ORDER in the @for loop
export interface TerminalLine {
  type: 'prompt' | 'output' | 'gap' | 'projects' | 'skills';
  command?: string;
  output?: string;
  displayText?: string;
  outputClass?: string;
  visible: boolean;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent implements OnInit, OnDestroy {
  // Single lines array — everything renders in order through @for
  lines = signal<TerminalLine[]>([]);
  showFinalPrompt = signal(false);
  currentTypingIndex = signal(-1);
  private timeouts: ReturnType<typeof setTimeout>[] = [];

  projects = [
    { name: 'netflix',     url: 'netflix.shivamsingh.website',   tech: 'Angular 19 · Node.js · PostgreSQL', wip: false },
    { name: 'rag-system',  url: 'rag.shivamsingh.website',       tech: 'Gemini AI · pgvector · Node.js',    wip: false },
    { name: 'monitoring',  url: 'monitoring.shivamsingh.website', tech: 'Session Replay · D3 · Chart.js',    wip: false },
    { name: 'coming-soon', url: 'shivamsingh.website',           tech: 'In progress...',                    wip: true  },
  ];

  skills = ['Angular 19', 'TypeScript', 'RxJS', 'Node.js', 'Express', 'PostgreSQL', 'Gemini AI', 'Chart.js', 'SCSS', 'Git'];

  private sequence: Omit<TerminalLine, 'visible' | 'displayText'>[] = [
    { type: 'prompt', command: 'whoami' },
    { type: 'output', output: 'Shivam Singh · Senior Angular Developer · 3+ yrs',    outputClass: 'cyan'  },
    { type: 'output', output: 'shivamsinghitwork@gmail.com · Gurugram, India',         outputClass: 'cyan'  },
    { type: 'output', output: 'open to work · target Rs.18-25 LPA',                   outputClass: 'muted' },
    { type: 'gap' },
    { type: 'prompt', command: 'cat experience.json' },
    { type: 'output', output: 'Songdew · Senior Software Engineer · Dec 2024-Present', outputClass: 'yellow' },
    { type: 'output', output: 'Cavisson · Software Engineer · Jan 2023-Nov 2024',      outputClass: 'yellow' },
    { type: 'gap' },
    { type: 'prompt', command: 'ls -la projects/' },
    { type: 'projects' },   // project cards sit HERE in the sequence — in order
    { type: 'gap' },
    { type: 'prompt', command: 'skills --list --top=10' },
    { type: 'skills' },     // skill tags sit HERE in the sequence — in order
  ];

  ngOnInit()    { this.startAnimation(); }
  ngOnDestroy() { this.clearTimeouts(); }

  private clearTimeouts() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
  }

  replay() {
    this.clearTimeouts();
    this.lines.set([]);
    this.showFinalPrompt.set(false);
    this.currentTypingIndex.set(-1);
    setTimeout(() => this.startAnimation(), 100);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      const t = setTimeout(resolve, ms);
      this.timeouts.push(t);
    });
  }

  private async typeText(lineIndex: number, fullText: string, speed: number): Promise<void> {
    for (let i = 1; i <= fullText.length; i++) {
      this.lines.update(lines => {
        const updated = [...lines];
        updated[lineIndex] = { ...updated[lineIndex], displayText: fullText.slice(0, i) };
        return updated;
      });
      await this.delay(speed);
    }
  }

  private async startAnimation() {
    await this.delay(800);

    for (let i = 0; i < this.sequence.length; i++) {
      const item = this.sequence[i];

      // ── GAP ──
      if (item.type === 'gap') {
        this.lines.update(l => [...l, { ...item, visible: true, displayText: '' }]);
        await this.delay(300);
        continue;
      }

      // ── PROMPT ──
      if (item.type === 'prompt') {
        this.lines.update(l => [...l, { ...item, visible: true, displayText: '' }]);
        const lineIndex = this.lines().length - 1;
        this.currentTypingIndex.set(lineIndex);
        await this.typeText(lineIndex, item.command || '', 95);
        await this.delay(400);
        this.currentTypingIndex.set(-1);
        await this.delay(200);
        continue;
      }

      // ── OUTPUT — appears instantly ──
      if (item.type === 'output') {
        this.lines.update(l => [...l, {
          ...item, visible: true, displayText: item.output || ''
        }]);
        await this.delay(180);
        continue;
      }

      // ── PROJECTS — add as a line type, appears right after ls command ──
      if (item.type === 'projects') {
        this.lines.update(l => [...l, { ...item, visible: true }]);
        await this.delay(1800); // pause so user can read the cards
        continue;
      }

      // ── SKILLS — add as a line type, appears right after skills command ──
      if (item.type === 'skills') {
        this.lines.update(l => [...l, { ...item, visible: true }]);
        await this.delay(600);
        this.showFinalPrompt.set(true); // final blinking cursor
        break;
      }
    }
  }

  isTypingLine(index: number): boolean { return this.currentTypingIndex() === index; }
  openProject(url: string) { window.open('https://' + url, '_blank'); }
}
