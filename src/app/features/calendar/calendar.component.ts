import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, model, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { DayScheduleComponent } from './components/day-schedule/day-schedule.component';
import { WeekScheduleComponent } from './components/week-schedule/week-schedule.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calendar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    NgTemplateOutlet,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    DayScheduleComponent,
    WeekScheduleComponent,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  selectedDate = model<Date>(new Date());
  scheduleControl = new FormControl('day');

  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  readonly dialog = inject(MatDialog);

  setToday() {
    const today = new Date();
    this.selectedDate.set(today)

    this.calendar.activeDate = today;
  }

  goToPreviousDay(): void {
    switch (this.scheduleControlValue) {
      case 'day':
        this.selectedDate().setDate(this.selectedDate().getDate() - 1);
        break;
      case 'week':
        this.selectedDate().setDate(this.selectedDate().getDate() - 7);
        break;
    }

    this.selectedDate.set(new Date(this.selectedDate()))
  }

  goToNext(): void {
    switch (this.scheduleControlValue) {
      case 'day':
        this.selectedDate().setDate(this.selectedDate().getDate() + 1);
        break;
      case 'week':
        this.selectedDate().setDate(this.selectedDate().getDate() + 7);
        break;
    }

    this.selectedDate.set(new Date(this.selectedDate()))
  }

  get scheduleControlValue() {
    return this.scheduleControl.value
  }

  addAppointment() {
    const dialogRef = this.dialog.open(AppointmentComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
