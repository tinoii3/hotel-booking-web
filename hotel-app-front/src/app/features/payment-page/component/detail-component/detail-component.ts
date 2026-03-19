import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'detail-component',
  imports: [ReactiveFormsModule],
  templateUrl: './detail-component.html',
  styleUrl: './detail-component.scss',
})
export class DetailComponent {
  @Output() formChange = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^0[0-9]{9}$/),
        ],
      ],
      note: [''],
    });

    this.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.formChange.emit({
          value,
          valid: this.form.valid,
        });
      });
  }

  get f() {
    return this.form.controls;
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getValue() {
    return this.form.value;
  }
}