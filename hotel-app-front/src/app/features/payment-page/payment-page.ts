import { Component } from '@angular/core';
import { PaymentMethodComponent } from './component/payment-method-component/payment-method-component';
import { DetailComponent } from './component/detail-component/detail-component';
import { DetailReservationComponent } from './component/detail-reservation-component/detail-reservation-component';
import { UserService } from '../../core/services/user-service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-page',
  imports: [PaymentMethodComponent, DetailComponent, DetailReservationComponent],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss',
})
export class PaymentPage {
  form!: FormGroup;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      // if (user) {
      //   this.form.patchValue({
      //     first_name: user.first_name,
      //     last_name: user.last_name,
      //     email: user.email,
      //   });
      // }
      console.log('User data loaded in PaymentPage:', user);
    });
  }
}
