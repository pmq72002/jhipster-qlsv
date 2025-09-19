import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewModeService {
  private mode = new BehaviorSubject<'info' | 'subject' | 'score'>('info');
  mode$ = this.mode.asObservable();

  setViewMode(mode: 'info' | 'subject' | 'score') {
    this.mode.next(mode);
  }
}
