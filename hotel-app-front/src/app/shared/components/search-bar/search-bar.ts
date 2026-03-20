import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { LucideAngularModule, Calendar, Users, BedDouble } from 'lucide-angular';
import { GUEST_OPTIONS, ROOM_TYPES } from '../../../core/constants/search.constants';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, LucideAngularModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit {
  roomTypes = ROOM_TYPES;
  guestOptions = GUEST_OPTIONS;

  @Output() search = new EventEmitter<any>();

  faSearch = faMagnifyingGlass;
  calendarIcon = Calendar;
  userIcon = Users;
  roomIcon = BedDouble;

  form: any;
  minCheckInDate!: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
      room_type: ['all', Validators.required],
      guests: [this.guestOptions[0], Validators.required],
    });
  }

  ngOnInit() {
    const today = new Date();
    this.minCheckInDate = this.formatDate(today);

    this.form.patchValue({
      check_in: this.formatDate(today),
      check_out: this.formatDate(new Date(today.getTime() + 86400000)),
    });

    this.form.get('check_in')?.valueChanges.subscribe((checkIn: any) => {
      const checkOut = this.form.get('check_out')?.value;

      if (checkIn && checkOut && checkIn > checkOut) {
        this.form.patchValue({ check_out: null });
      }
    });

    this.form.get('check_out')?.valueChanges.subscribe((checkOut: any) => {
      const checkIn = this.form.get('check_in')?.value;

      if (checkIn && checkOut && checkOut < checkIn) {
        this.form.patchValue({ check_in: null });
      }
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSearch() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { check_in, check_out } = this.form.value;

    if (check_in && check_out && check_out <= check_in) {
      alert('Check-out must be after Check-in');
      return;
    }

    this.search.emit(this.form.value);
  }
}
