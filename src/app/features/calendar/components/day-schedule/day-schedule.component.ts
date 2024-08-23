import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from '../appointment/appointment.component';
import { ITimeSlotsView } from '../../utils/unions';

@Component({
  selector: 'app-day-schedule',
  standalone: true,
  imports: [DatePipe, JsonPipe],
  templateUrl: './day-schedule.component.html',
  styleUrl: './day-schedule.component.scss'
})
export class DayScheduleComponent {
  @Input() selectedDay!: Date;
  @Input() keyDate!: string | null;

  appointments = inject(AppointmentService)

  timeSlots = signal<ITimeSlotsView[]>([]);

  getAppointments = this.appointments.appointments;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getHours()
  }

  validProperty(item: any) {
    if (!this.keyDate) {
      return
    }

    return this.getAppointments()[this.keyDate]?.hasOwnProperty(item.time)
  }

  getHours() {
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

        this.timeSlots.update((state) => [...state, property]);
      }
    }
  }

  onAppointmentClick(appointment: any) {
    const dialogRef = this.dialog.open(AppointmentComponent, {
      data: {
        appointment,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
