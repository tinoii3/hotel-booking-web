import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appExpiryMask]',
})
export class ExpiryMask {

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value;

    value = value.replace(/\D/g, '').substring(0, 4);

    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    this.control.control?.setValue(value, { emitEvent: false });
  }
}
