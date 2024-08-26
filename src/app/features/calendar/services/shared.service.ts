import { Injectable, Signal, WritableSignal } from '@angular/core';
import { ITimeSlotsView } from '../utils/unions';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  validProperty(keyDate: string, keyTime: string, obj: Signal<any>) {
    if (!keyDate) {
      return
    }

    return obj()[keyDate]?.hasOwnProperty(keyTime)
  }

  getHours(timeSlots: WritableSignal<any>) {
    const startHour = 9;
    const endHour = 21;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour);
        time.setMinutes(minute);
        time.setSeconds(0);

        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const property = {
          time: formattedTime,
          clickable: formattedTime[3] === '0'
        } as ITimeSlotsView;

        timeSlots.update((state) => [...state, property]);
      }
    }
  }

}
