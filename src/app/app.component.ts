import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgTimepickerModule } from '../../projects/ng-scroll-timepicker/src/lib/ng-timepicker.module';
import { TimeFormat } from '../../projects/ng-scroll-timepicker/src/lib/timepicker/timepicker.types';
import { TimepickerConfig } from '../../projects/ng-scroll-timepicker/src/lib/timepicker/timepicker.config';
import { TimepickerTheme } from '../../projects/ng-scroll-timepicker/src/lib/timepicker/ng-timepicker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgTimepickerModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  format: TimeFormat = '12h';
  theme: TimepickerTheme = 'light';
  selectedTime = '09:45 am';
  timeControl = new FormControl('09:45 am');

  // Custom config — change any field to override defaults
  customConfig: TimepickerConfig = {
    itemHeight: 48,
    visibleItems: 5,
    fontSizeSelected: 22,
    fontSizeNear: 18,
    fontSizeFar: 15,
    opacityNear: 0.45,
    opacityFar: 0.2,
    opacityHidden: 0.08,
  };

  onTimeChange(time: string): void {
    this.selectedTime = time;
  }

  onFormatChange(f: TimeFormat): void {
    this.format = f;
    const defaultTime = f === '12h' ? '09:45 am' : '09:45';
    this.selectedTime = defaultTime;
    this.timeControl.setValue(defaultTime);
  }
}
