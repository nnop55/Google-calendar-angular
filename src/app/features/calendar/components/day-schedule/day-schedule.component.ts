import { DatePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from '../appointment/appointment.component';
import { ITimeSlotsView } from '../../utils/unions';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-day-schedule',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './day-schedule.component.html',
  styleUrl: './day-schedule.component.scss'
})
export class DayScheduleComponent {
  @Input() selectedDay!: Date;
  @Input() keyDate!: string | null;

  readonly dialog = inject(MatDialog);
  readonly apService = inject(AppointmentService)
  readonly shared = inject(SharedService)

  timeSlots = signal<ITimeSlotsView[]>([]);

  getAppointments = this.apService.appointments;

  ngOnInit(): void {
    this.getHours()
  }

  validProperty(keyTime: string) {
    return this.shared.validProperty(this.keyDate!, keyTime, this.getAppointments)
  }

  getHours() {
    this.shared.getHours(this.timeSlots)
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
