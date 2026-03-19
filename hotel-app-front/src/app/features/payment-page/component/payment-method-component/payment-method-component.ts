import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardMask } from '../../../../shared/directives/card-mask/card-mask';
import { ExpiryMask } from '../../../../shared/directives/expiry-mask/expiry-mask';

@Component({
  selector: 'payment-method-component',
  standalone: true,
  imports: [ReactiveFormsModule, CardMask, ExpiryMask],
  templateUrl: './payment-method-component.html',
  styleUrl: './payment-method-component.scss',
})
export class PaymentMethodComponent {

  @Output() formChange = new EventEmitter<any>();
  @Output() submitPayment = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)
        ]
      ],
      expiry: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
        ]
      ],
      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3,4}$/)
        ]
      ],
    });

    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(value);
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('PAYMENT PAYLOAD:', this.form.value);

    this.submitPayment.emit(this.form.value);
  }
}