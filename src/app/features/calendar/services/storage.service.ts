import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';
import { DailyAppointments } from '../utils/unions';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storage = inject(LOCAL_STORAGE);

  constructor() { }

  load() {
    const appointments = this.storage.getItem('TM_APPOINTMENTS');
    return of(appointments ? JSON.parse(appointments) : {});
  }

  save(appointments: DailyAppointments) {
    this.storage.setItem('TM_APPOINTMENTS', JSON.stringify(appointments));
  }

}
