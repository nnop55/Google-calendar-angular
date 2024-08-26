import { Component, inject, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentForm } from '../../utils/unions';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent {
  form!: FormGroup;

  timeSlotsFrom = signal<any[]>([]);
  timeSlotsTo = signal<any[]>([]);

  readonly datePipe = inject(DatePipe)
  readonly apService = inject(AppointmentService)

  range: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      appointment: any,
      isEdit: boolean
    },
    public dialogRef: MatDialogRef<AppointmentComponent>
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getSlotsFrom()
    this.setFormValues()
  }

  initForm() {
    this.form = new FormGroup<AppointmentForm>({
      title: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      timeStart: new FormControl(null, [Validators.required]),
      timeEnd: new FormControl(null, [Validators.required]),
    })
  }

  setFormValues() {
    if (!this.data?.isEdit) {
      return
    }

    const appointment = this.data.appointment

    this.form.patchValue({
      title: appointment.title,
      date: appointment.date,
      timeStart: appointment.timeStart,
      timeEnd: appointment.timeEnd
    })

    this.getSlotsTo(appointment.timeStart);
    this.range = appointment.range
  }

  getSlotsFrom() {
    const startHour = 9;
    const endHour = 21;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour);
        time.setMinutes(minute);
        time.setSeconds(0);

        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.timeSlotsFrom.update((state) => [...state, formattedTime]);
      }
    }

  }

  getSlotsTo(from: string) {
    const ind = this.timeSlotsFrom().findIndex((o) => o === from);
    this.timeSlotsTo.set(this.timeSlotsFrom().slice(ind + 1))
  }

  getRange(from: string) {
    const ind = this.timeSlotsTo().findIndex((o) => o === from);
    this.range = ind + 1
  }

  get f() {
    return this.form.controls
  }

  handleSelection(ev: any, type: 'from' | 'to') {
    switch (type) {
      case 'from':
        this.getSlotsTo(ev.value)
        if (this.f['timeEnd']?.value) {
          this.getRange(this.f['timeEnd']?.value)
        }
        if (!this.timeSlotsTo().includes(this.f['timeEnd']?.value)) {
          this.f['timeEnd'].reset()
        }
        break;
      case 'to':
        this.getRange(ev.value)
        break;
    }
  }

  removeAppointment() {
    const appointment = this.data.appointment;

    const date = this.datePipe.transform(appointment.date, 'dd/MM/yyyy') ?? ''
    const hour = appointment.timeStart;

    this.apService.removeAppointment({ date, hour });
    this.close()
  }

  submitForm(form: FormGroup) {
    if (form.invalid) {
      return
    }

    const date = this.datePipe.transform(form.value.date, 'dd/MM/yyyy') ?? '';
    const hour = form.value.timeStart;

    if (this.data?.isEdit) {
      const oldDate = this.datePipe.transform(this.data.appointment.date, 'dd/MM/yyyy') ?? '';

      this.apService.editAppointment({
        date,
        hour,
        oldDate,
        oldHour: this.data.appointment.timeStart,
        appointment: {
          title: form.value.title,
          timeEnd: form.value.timeEnd,
          date: form.value.date,
          range: this.range,
          timeStart: hour
        }
      });
    } else {
      this.apService.addAppointment({
        date,
        hour,
        appointment: {
          title: form.value.title,
          timeEnd: form.value.timeEnd,
          date: form.value.date,
          range: this.range,
          timeStart: hour
        }
      });
    }

    this.close()
  }

  close() {
    this.dialogRef.close()
  }
}

