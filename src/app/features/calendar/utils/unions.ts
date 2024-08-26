import { FormControl } from "@angular/forms"

export interface AppointmentState {
    appointments: DailyAppointments,
    loaded: boolean,
    error: null | undefined | string
}

export type AppointmentForm = {
    title: FormControl<string | null>,
    timeStart: FormControl<string | null>,
    timeEnd: FormControl<string | null>,
    date: FormControl<Date | null>,
}

export interface ITimeSlotsView {
    time: string;
    clickable: boolean;
}

export interface IWeekDaysView {
    title: string;
    value: string;
}

export interface AddAppointment {
    date: string;
    hour: string;
    appointment: Appointment
}

export interface EditAppointment extends AddAppointment {
    oldDate: string;
    oldHour: string;
}

export interface RemoveAppointment {
    date: string;
    hour: string;
}

export type Appointment = {
    title: string;
    date: string;
    range: number;
    timeStart: string
    timeEnd: string;
}

export type DailyAppointments = {
    [date: string]: HourlyAppointments;
};

type HourlyAppointments = {
    [hour: string]: Appointment[];
};


