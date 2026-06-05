import { EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TimeFormat } from './timepicker.types';
import { TimepickerConfig } from './timepicker.config';
import * as i0 from "@angular/core";
export type TimepickerTheme = 'light' | 'dark';
export declare class NgTimepickerComponent implements OnInit, OnChanges, ControlValueAccessor {
    private cdr;
    /** '12h' shows am/pm column; '24h' shows 00–23 hours with no am/pm */
    format: TimeFormat;
    /** Initial time string. Accepted: "9:45 am", "09:45 am", "21:45" */
    value: string;
    /**
     * Built-in theme preset.
     * 'light' (default) — white background, dark text.
     * 'dark' — dark surface, light text.
     * For full control, override CSS custom properties instead:
     *   --tp-bg, --tp-selection-bg, --tp-text-color, --tp-separator-color,
     *   --tp-selection-radius, --tp-picker-radius, --tp-picker-padding
     */
    theme: TimepickerTheme;
    /**
     * Layout & typography configuration.
     * Partial — only specify the values you want to change.
     *
     * @example
     * [config]="{ itemHeight: 56, fontSizeSelected: 24, opacityNear: 0.5 }"
     */
    config: TimepickerConfig;
    /** Emits formatted time string on every change */
    timeChange: EventEmitter<string>;
    hours12: string[];
    hours24: string[];
    minutes: string[];
    periods: string[];
    hourIndex: number;
    minuteIndex: number;
    periodIndex: number;
    private onChange;
    private onTouched;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /** Merged config — DEFAULT_CONFIG + consumer overrides */
    get mergedConfig(): Required<TimepickerConfig>;
    /**
     * CSS variables injected onto the root element.
     * --tp-item-height drives the selection-box height and separator line-height
     * without requiring the SCSS to know the runtime value.
     */
    get rootVars(): Record<string, string>;
    get hourItems(): string[];
    writeValue(val: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    onHourChange(index: number): void;
    onMinuteChange(index: number): void;
    onPeriodChange(index: number): void;
    private buildArrays;
    private parseValue;
    private setDefaults;
    private emit;
    buildTimeString(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgTimepickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgTimepickerComponent, "ng-scroll-timepicker", never, { "format": { "alias": "format"; "required": false; }; "value": { "alias": "value"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "config": { "alias": "config"; "required": false; }; }, { "timeChange": "timeChange"; }, never, never, true, never>;
}
//# sourceMappingURL=ng-timepicker.component.d.ts.map