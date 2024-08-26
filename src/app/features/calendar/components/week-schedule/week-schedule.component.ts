import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { Appointment, ITimeSlotsView, IWeekDaysView } from '../../utils/unions';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentComponent } from '../appointment/appointment.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../services/shared.service';

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
  readonly apService = inject(AppointmentService)
  readonly shared = inject(SharedService)

  @Input() selectedWeek!: Date;

  timeSlots = signal<ITimeSlotsView[]>([]);
  weekDays = signal<IWeekDaysView[]>([]);

  getAppointments = this.apService.appointments;

  ngOnInit(): void {
    this.getHours();
    this.updateWeekDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWeek']) {
      this.updateWeekDays()
    }
  }

  validProperty(keyDate: string, keyTime: string) {
    return this.shared.validProperty(keyDate, keyTime, this.getAppointments)
  }

  getHours() {
    this.shared.getHours(this.timeSlots)
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

  onAppointmentClick(appointment: Appointment) {
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
