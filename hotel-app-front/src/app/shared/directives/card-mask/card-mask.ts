import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCardMask]',
})
export class CardMask {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value;

    value = value.replace(/\D/g, '').substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();

    this.control.control?.setValue(value, { emitEvent: false });
  }
}
