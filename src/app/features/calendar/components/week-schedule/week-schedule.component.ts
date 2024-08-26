import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { ITimeSlotsView } from '../../utils/unions';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentComponent } from '../appointment/appointment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-week-schedule',
  standalone: true,
  providers: [DatePipe],
  imports: [],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent {

  readonly datePipe = inject(DatePipe)
  readonly dialog = inject(MatDialog);
  appointments = inject(AppointmentService)

  @Input() selectedWeek!: Date;

  timeSlots = signal<ITimeSlotsView[]>([]);
  weekDays = signal<any[]>([]);

  getAppointments = this.appointments.appointments;

  ngOnInit(): void {
    this.getHours();
    this.updateWeekDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWeek']) {
      this.updateWeekDays()
    }
  }

  validProperty(keyDate: any, keyTime: any) {
    if (!keyDate) {
      return
    }

    return this.getAppointments()[keyDate]?.hasOwnProperty(keyTime)
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

  updateWeekDays() {
    const daysOfWeek = [];
    const currentDay = new Date(this.selectedWeek);

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDay);
      day.setDate(currentDay.getDate() + i);
      const title = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const value = this.datePipe.transform(day, 'dd/MM/yyyy') ?? '';
      daysOfWeek.push({ title, value });
    }


    this.weekDays.set(daysOfWeek);
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
