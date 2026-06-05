import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModelChainItem {
  id: string;
  name: string;
  status: 'active' | 'failed' | 'pending';
}

@Component({
  selector: 'app-model-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-status.component.html',
  styleUrl: './model-status.component.scss'
})
export class ModelStatusComponent implements OnChanges {
  @Input() currentModel = 'Gemini 3.1 Flash Lite';
  @Input() switched = false;
  @Input() exhausted = false;

  // Full model chain — matches backend MODEL_CHAIN order
  readonly fullChain: ModelChainItem[] = [
    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', status: 'pending' },
    { id: 'gemma-4-31b',           name: 'Gemma 4 31B',           status: 'pending' },
    { id: 'gemma-4-26b',           name: 'Gemma 4 26B',           status: 'pending' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', status: 'pending' },
    { id: 'gemini-3.5-flash',      name: 'Gemini 3.5 Flash',      status: 'pending' },
  ];

  chain = signal<ModelChainItem[]>([...this.fullChain]);
  isSwitching = signal(false);
  switchingMessage = signal('');
  state = signal<'normal' | 'switching' | 'fallback' | 'exhausted'>('normal');
  isPrimary = signal(true);
  fallbackNumber = signal(0);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentModel'] || changes['switched'] || changes['exhausted']) {
      this.updateChainState();
    }
  }

  private updateChainState() {
    if (this.exhausted) {
      // Mark all as failed
      this.chain.set(this.fullChain.map(m => ({ ...m, status: 'failed' })));
      this.state.set('exhausted');
      this.isSwitching.set(false);
      return;
    }

    const currentIndex = this.fullChain.findIndex(m =>
      this.currentModel?.toLowerCase().includes(m.id.toLowerCase()) ||
      m.name.toLowerCase().includes(this.currentModel?.toLowerCase())
    );

    const idx = currentIndex >= 0 ? currentIndex : 0;
    this.isPrimary.set(idx === 0);
    this.fallbackNumber.set(idx);

    // Update chain statuses
    const updated = this.fullChain.map((m, i) => ({
      ...m,
      status: i < idx ? 'failed' : i === idx ? 'active' : 'pending'
    })) as ModelChainItem[];

    if (this.switched && idx > 0) {
      // Show switching animation
      this.isSwitching.set(true);
      this.state.set('switching');

      const prevModel = this.fullChain[idx - 1]?.name || 'Previous model';
      this.switchingMessage.set(
        `Rate limit hit on ${prevModel} → switching to ${this.currentModel}`
      );

      // After 3 seconds settle into fallback state
      setTimeout(() => {
        this.isSwitching.set(false);
        this.state.set(idx === 0 ? 'normal' : 'fallback');
        this.chain.set(updated);
      }, 3000);
    } else {
      this.chain.set(updated);
      this.state.set(idx === 0 ? 'normal' : 'fallback');
      this.isSwitching.set(false);
    }
  }

  getStatusColor(): string {
    switch (this.state()) {
      case 'normal':    return '#a6e3a1';
      case 'switching': return '#f9e2af';
      case 'fallback':  return '#cba6f7';
      case 'exhausted': return '#f38ba8';
    }
  }

  getStatusLabel(): string {
    switch (this.state()) {
      case 'normal':    return 'PRIMARY';
      case 'switching': return 'SWITCHING';
      case 'fallback':  return `FALLBACK #${this.fallbackNumber()}`;
      case 'exhausted': return 'EXHAUSTED';
    }
  }

  getStatusText(): string {
    switch (this.state()) {
      case 'normal':    return 'AI FALLBACK CHAIN · CURRENTLY USING';
      case 'switching': return 'AI FALLBACK CHAIN · SWITCHING MODEL';
      case 'fallback':  return 'AI FALLBACK CHAIN · FALLBACK ACTIVE';
      case 'exhausted': return 'AI FALLBACK CHAIN · ALL MODELS RATE LIMITED';
    }
  }

  getIcon(): string {
    switch (this.state()) {
      case 'normal':    return '🤖';
      case 'switching': return '🔄';
      case 'fallback':  return '🤖';
      case 'exhausted': return '⚠️';
    }
  }
}
