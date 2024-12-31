import { FormControl, FormGroup, FormArray } from '@angular/forms';

/** Utility-Type for easy use of type T in the context of reactive forms */
export type ReactiveForm<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? FormArray<U extends object ? FormGroup<ReactiveForm<U>> : FormControl<U>>
    : T[K] extends object ? FormGroup<ReactiveForm<T[K]>> : FormControl<T[K]>;
};
