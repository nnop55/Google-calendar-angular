import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { AddAppointment, EditAppointment, RemoveAppointment } from '../utils/unions';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private storageService = inject(StorageService);
  private destroyRef = inject(DestroyRef);

  // state
  private state = signal<any>({
    appointments: {},
    loaded: false,
    error: null,
  });

  // selectors
  appointments = computed(() => this.state().appointments);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error);

  private appointmentsLoaded$ = this.storageService.load();

  // sources
  private add$ = new Subject<AddAppointment>();
  private edit$ = new Subject<EditAppointment>();
  private remove$ = new Subject<RemoveAppointment>();

  constructor() {
    // reducers
    this.appointmentsLoaded$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (appointments) =>
        this.state.update((state) => ({
          ...state,
          appointments,
          loaded: true,
        })),
      error: (err) => this.state.update((state) => ({ ...state, error: err })),
    });

    this.add$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params) => {
      this.state.update((state) => ({
        ...state,
        appointments: this.setAppointment(state.appointments, params),
      }))
    });

    this.edit$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params) => {
      this.state.update((state) => ({
        ...state,
        appointments: this.updateAppointment(state.appointments, params),
      }))
    });

    this.remove$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params) =>
      this.state.update((state) => ({
        ...state,
        appointments: this.deleteAppointment(state.appointments, params),
      }))
    );


    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.save(this.appointments());
      }
    });
  }

  addAppointment(params: AddAppointment) {
    this.add$.next(params)
  }

  editAppointment(params: EditAppointment) {
    this.edit$.next(params)
  }

  removeAppointment(params: RemoveAppointment) {
    this.remove$.next(params)
  }

  private setAppointment(existingAppointments: any, params: any) {
    return {
      ...existingAppointments,
      [params.date]: {
        ...existingAppointments[params.date],
        [params.hour]: [params.appointment],
      }
    }
  }

  private updateAppointment(existingAppointments: any, params: any) {
    const newRef = existingAppointments[params.oldDate];
    delete newRef[params.oldHour];
    existingAppointments[params.date] = newRef[params.hour];
    return this.setAppointment(existingAppointments, params)
  }

  private deleteAppointment(existingAppointments: any, params: any) {
    const newRef = existingAppointments[params.date];
    delete newRef[params.hour];
    existingAppointments[params.date] = newRef;
    return {
      ...existingAppointments
    }
  }
}
