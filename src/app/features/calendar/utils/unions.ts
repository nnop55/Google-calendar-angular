import { FormControl } from "@angular/forms"

export type AppointmentForm = {
    title: FormControl<string | null>,
    timeStart: FormControl<string | null>,
    timeEnd: FormControl<string | null>,
    date: FormControl<Date | null>,
}

export class ITimeSlotsView {
    time!: string;
    clickable!: boolean;
}

export interface AddAppointment {
    date: string;
    hour: string;
    appointment: {
        title: string;
        date: string;
        range: number;
        timeStart: string
        timeEnd: string;
    }
}

export interface EditAppointment extends AddAppointment {
    oldDate: string;
    oldHour: string;
}

export interface RemoveAppointment {
    date: string;
    hour: string;
}

