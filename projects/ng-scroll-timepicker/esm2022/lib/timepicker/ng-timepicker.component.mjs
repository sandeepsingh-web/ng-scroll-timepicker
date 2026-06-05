import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScrollColumnComponent } from '../scroll-column/scroll-column.component';
import { DEFAULT_CONFIG } from './timepicker.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgTimepickerComponent {
    constructor(cdr) {
        this.cdr = cdr;
        /** '12h' shows am/pm column; '24h' shows 00–23 hours with no am/pm */
        this.format = '12h';
        /** Initial time string. Accepted: "9:45 am", "09:45 am", "21:45" */
        this.value = '';
        /**
         * Built-in theme preset.
         * 'light' (default) — white background, dark text.
         * 'dark' — dark surface, light text.
         * For full control, override CSS custom properties instead:
         *   --tp-bg, --tp-selection-bg, --tp-text-color, --tp-separator-color,
         *   --tp-selection-radius, --tp-picker-radius, --tp-picker-padding
         */
        this.theme = 'light';
        /**
         * Layout & typography configuration.
         * Partial — only specify the values you want to change.
         *
         * @example
         * [config]="{ itemHeight: 56, fontSizeSelected: 24, opacityNear: 0.5 }"
         */
        this.config = {};
        /** Emits formatted time string on every change */
        this.timeChange = new EventEmitter();
        this.hours12 = [];
        this.hours24 = [];
        this.minutes = [];
        this.periods = ['am', 'pm'];
        this.hourIndex = 0;
        this.minuteIndex = 0;
        this.periodIndex = 0;
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    ngOnInit() {
        this.buildArrays();
        this.parseValue(this.value);
    }
    ngOnChanges(changes) {
        if (changes['format'] && !changes['format'].firstChange) {
            this.buildArrays();
            this.parseValue(this.value);
        }
        if (changes['value'] && !changes['value'].firstChange) {
            this.parseValue(this.value);
        }
    }
    /** Merged config — DEFAULT_CONFIG + consumer overrides */
    get mergedConfig() {
        return { ...DEFAULT_CONFIG, ...this.config };
    }
    /**
     * CSS variables injected onto the root element.
     * --tp-item-height drives the selection-box height and separator line-height
     * without requiring the SCSS to know the runtime value.
     */
    get rootVars() {
        return { '--tp-item-height': `${this.mergedConfig.itemHeight}px` };
    }
    get hourItems() {
        return this.format === '12h' ? this.hours12 : this.hours24;
    }
    // ── ControlValueAccessor ─────────────────────────────────────────────────
    writeValue(val) {
        if (val != null) {
            this.parseValue(val);
            this.cdr.markForCheck();
        }
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    // ── Handlers ─────────────────────────────────────────────────────────────
    onHourChange(index) { this.hourIndex = index; this.emit(); }
    onMinuteChange(index) { this.minuteIndex = index; this.emit(); }
    onPeriodChange(index) { this.periodIndex = index; this.emit(); }
    // ── Internals ─────────────────────────────────────────────────────────────
    buildArrays() {
        this.hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
        this.hours24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        this.minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    }
    parseValue(val) {
        if (!val) {
            this.setDefaults();
            return;
        }
        const normalized = val.trim().toLowerCase();
        const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/);
        if (!match) {
            this.setDefaults();
            return;
        }
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const period = match[3];
        if (this.format === '12h') {
            if (period) {
                this.periodIndex = period === 'am' ? 0 : 1;
            }
            else {
                if (h >= 12) {
                    this.periodIndex = 1;
                    if (h > 12)
                        h -= 12;
                }
                else {
                    this.periodIndex = 0;
                    if (h === 0)
                        h = 12;
                }
            }
            this.hourIndex = Math.max(0, Math.min((h - 1 + 12) % 12, 11));
        }
        else {
            if (period === 'pm' && h < 12)
                h += 12;
            else if (period === 'am' && h === 12)
                h = 0;
            this.hourIndex = Math.max(0, Math.min(h, 23));
        }
        this.minuteIndex = Math.max(0, Math.min(m, 59));
        this.cdr.markForCheck();
    }
    setDefaults() {
        this.hourIndex = this.format === '12h' ? 8 : 9;
        this.minuteIndex = 0;
        this.periodIndex = 0;
    }
    emit() {
        const time = this.buildTimeString();
        this.timeChange.emit(time);
        this.onChange(time);
    }
    buildTimeString() {
        const h = this.hourItems[this.hourIndex];
        const m = this.minutes[this.minuteIndex];
        if (this.format === '12h')
            return `${h}:${m} ${this.periods[this.periodIndex]}`;
        return `${h}:${m}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: NgTimepickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.14", type: NgTimepickerComponent, isStandalone: true, selector: "ng-scroll-timepicker", inputs: { format: "format", value: "value", theme: "theme", config: "config" }, outputs: { timeChange: "timeChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => NgTimepickerComponent),
                multi: true,
            },
        ], usesOnChanges: true, ngImport: i0, template: "<div class=\"tp-root\"\n     [class.tp-dark]=\"theme === 'dark'\"\n     [ngStyle]=\"rootVars\">\n\n  <!-- Selection highlight box \u2014 height tracks itemHeight via --tp-item-height -->\n  <div class=\"tp-selection-box\"></div>\n\n  <div class=\"tp-columns\">\n    <!-- Hours column -->\n    <tp-scroll-column\n      [items]=\"hourItems\"\n      [selectedIndex]=\"hourIndex\"\n      [config]=\"mergedConfig\"\n      (selectedIndexChange)=\"onHourChange($event)\"\n      class=\"tp-col-number\"\n    ></tp-scroll-column>\n\n    <!-- Colon separator -->\n    <div class=\"tp-separator\">:</div>\n\n    <!-- Minutes column -->\n    <tp-scroll-column\n      [items]=\"minutes\"\n      [selectedIndex]=\"minuteIndex\"\n      [config]=\"mergedConfig\"\n      (selectedIndexChange)=\"onMinuteChange($event)\"\n      class=\"tp-col-number\"\n    ></tp-scroll-column>\n\n    <!-- AM/PM column \u2014 only in 12h format -->\n    <tp-scroll-column\n      *ngIf=\"format === '12h'\"\n      [items]=\"periods\"\n      [selectedIndex]=\"periodIndex\"\n      [config]=\"mergedConfig\"\n      (selectedIndexChange)=\"onPeriodChange($event)\"\n      class=\"tp-col-period\"\n    ></tp-scroll-column>\n  </div>\n</div>\n", styles: [":host{display:inline-block;--tp-bg: #ffffff;--tp-selection-bg: rgba(0, 0, 0, .055);--tp-picker-radius: 16px;--tp-picker-padding: 8px 12px;--tp-selection-radius: 12px;--tp-text-color: #1a1a1a;--tp-separator-color: #1a1a1a;--tp-item-height: 48px}.tp-root{position:relative;display:inline-flex;background:var(--tp-bg);border-radius:var(--tp-picker-radius);padding:var(--tp-picker-padding);-webkit-user-select:none;user-select:none;transition:background .2s ease}.tp-root.tp-dark{--tp-bg: #1c1c1e;--tp-selection-bg: rgba(255, 255, 255, .12);--tp-text-color: #f5f5f7;--tp-separator-color: #f5f5f7}.tp-selection-box{position:absolute;left:12px;right:12px;height:var(--tp-item-height);top:50%;transform:translateY(-50%);background:var(--tp-selection-bg);border-radius:var(--tp-selection-radius);pointer-events:none;z-index:0;transition:background .2s ease}.tp-columns{display:flex;align-items:center;position:relative;z-index:1}.tp-separator{font-size:22px;font-weight:700;color:var(--tp-separator-color);padding:0 4px;line-height:var(--tp-item-height);transition:color .2s ease}:host ::ng-deep .tp-col-number tp-scroll-column .tp-item{min-width:52px}:host ::ng-deep .tp-col-period tp-scroll-column .tp-item{min-width:46px;text-transform:lowercase}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: ScrollColumnComponent, selector: "tp-scroll-column", inputs: ["items", "selectedIndex", "config"], outputs: ["selectedIndexChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: NgTimepickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-scroll-timepicker', standalone: true, imports: [CommonModule, ScrollColumnComponent], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NgTimepickerComponent),
                            multi: true,
                        },
                    ], template: "<div class=\"tp-root\"\n     [class.tp-dark]=\"theme === 'dark'\"\n     [ngStyle]=\"rootVars\">\n\n  <!-- Selection highlight box \u2014 height tracks itemHeight via --tp-item-height -->\n  <div class=\"tp-selection-box\"></div>\n\n  <div class=\"tp-columns\">\n    <!-- Hours column -->\n    <tp-scroll-column\n      [items]=\"hourItems\"\n      [selectedIndex]=\"hourIndex\"\n      [config]=\"mergedConfig\"\n      (selectedIndexChange)=\"onHourChange($event)\"\n      class=\"tp-col-number\"\n    ></tp-scroll-column>\n\n    <!-- Colon separator -->\n    <div class=\"tp-separator\">:</div>\n\n    <!-- Minutes column -->\n    <tp-scroll-column\n      [items]=\"minutes\"\n      [selectedIndex]=\"minuteIndex\"\n      [config]=\"mergedConfig\"\n      (selectedIndexChange)=\"onMinuteChange($event)\"\n      class=\"tp-col-number\"\n    ></tp-scroll-column>\n\n    <!-- AM/PM column \u2014 only in 12h format -->\n    <tp-scroll-column\n      *ngIf=\"format === '12h'\"\n      [items]=\"periods\"\n      [selectedIndex]=\"periodIndex\"\n      [config]=\"mergedConfig\"\n      (selectedIndexChange)=\"onPeriodChange($event)\"\n      class=\"tp-col-period\"\n    ></tp-scroll-column>\n  </div>\n</div>\n", styles: [":host{display:inline-block;--tp-bg: #ffffff;--tp-selection-bg: rgba(0, 0, 0, .055);--tp-picker-radius: 16px;--tp-picker-padding: 8px 12px;--tp-selection-radius: 12px;--tp-text-color: #1a1a1a;--tp-separator-color: #1a1a1a;--tp-item-height: 48px}.tp-root{position:relative;display:inline-flex;background:var(--tp-bg);border-radius:var(--tp-picker-radius);padding:var(--tp-picker-padding);-webkit-user-select:none;user-select:none;transition:background .2s ease}.tp-root.tp-dark{--tp-bg: #1c1c1e;--tp-selection-bg: rgba(255, 255, 255, .12);--tp-text-color: #f5f5f7;--tp-separator-color: #f5f5f7}.tp-selection-box{position:absolute;left:12px;right:12px;height:var(--tp-item-height);top:50%;transform:translateY(-50%);background:var(--tp-selection-bg);border-radius:var(--tp-selection-radius);pointer-events:none;z-index:0;transition:background .2s ease}.tp-columns{display:flex;align-items:center;position:relative;z-index:1}.tp-separator{font-size:22px;font-weight:700;color:var(--tp-separator-color);padding:0 4px;line-height:var(--tp-item-height);transition:color .2s ease}:host ::ng-deep .tp-col-number tp-scroll-column .tp-item{min-width:52px}:host ::ng-deep .tp-col-period tp-scroll-column .tp-item{min-width:46px;text-transform:lowercase}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { format: [{
                type: Input
            }], value: [{
                type: Input
            }], theme: [{
                type: Input
            }], config: [{
                type: Input
            }], timeChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdGltZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3RpbWVwaWNrZXIvbmctdGltZXBpY2tlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9zcmMvbGliL3RpbWVwaWNrZXIvbmctdGltZXBpY2tlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUlaLFVBQVUsRUFDVix1QkFBdUIsR0FFeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUVqRixPQUFPLEVBQUUsY0FBYyxFQUFvQixNQUFNLHFCQUFxQixDQUFDOzs7QUFtQnZFLE1BQU0sT0FBTyxxQkFBcUI7SUF5Q2hDLFlBQW9CLEdBQXNCO1FBQXRCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBeEMxQyxzRUFBc0U7UUFDN0QsV0FBTSxHQUFlLEtBQUssQ0FBQztRQUVwQyxvRUFBb0U7UUFDM0QsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUVwQjs7Ozs7OztXQU9HO1FBQ00sVUFBSyxHQUFvQixPQUFPLENBQUM7UUFFMUM7Ozs7OztXQU1HO1FBQ00sV0FBTSxHQUFxQixFQUFFLENBQUM7UUFFdkMsa0RBQWtEO1FBQ3hDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBRWxELFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLFlBQU8sR0FBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FB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cUI7OzRGQVlsQyxxQkFBcUI7a0JBZmpDLFNBQVM7K0JBQ0Usc0JBQXNCLGNBQ3BCLElBQUksV0FDUCxDQUFDLFlBQVksRUFBRSxxQkFBcUIsQ0FBQyxtQkFHN0IsdUJBQXVCLENBQUMsTUFBTSxhQUNwQzt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQzs0QkFDcEQsS0FBSyxFQUFFLElBQUk7eUJBQ1o7cUJBQ0Y7c0ZBSVEsTUFBTTtzQkFBZCxLQUFLO2dCQUdHLEtBQUs7c0JBQWIsS0FBSztnQkFVRyxLQUFLO3NCQUFiLEtBQUs7Z0JBU0csTUFBTTtzQkFBZCxLQUFLO2dCQUdJLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGZvcndhcmRSZWYsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU2Nyb2xsQ29sdW1uQ29tcG9uZW50IH0gZnJvbSAnLi4vc2Nyb2xsLWNvbHVtbi9zY3JvbGwtY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUaW1lRm9ybWF0LCBUaW1lVmFsdWUgfSBmcm9tICcuL3RpbWVwaWNrZXIudHlwZXMnO1xuaW1wb3J0IHsgREVGQVVMVF9DT05GSUcsIFRpbWVwaWNrZXJDb25maWcgfSBmcm9tICcuL3RpbWVwaWNrZXIuY29uZmlnJztcblxuZXhwb3J0IHR5cGUgVGltZXBpY2tlclRoZW1lID0gJ2xpZ2h0JyB8ICdkYXJrJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctc2Nyb2xsLXRpbWVwaWNrZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBTY3JvbGxDb2x1bW5Db21wb25lbnRdLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctdGltZXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLXRpbWVwaWNrZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdUaW1lcGlja2VyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE5nVGltZXBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKiAnMTJoJyBzaG93cyBhbS9wbSBjb2x1bW47ICcyNGgnIHNob3dzIDAw4oCTMjMgaG91cnMgd2l0aCBubyBhbS9wbSAqL1xuICBASW5wdXQoKSBmb3JtYXQ6IFRpbWVGb3JtYXQgPSAnMTJoJztcblxuICAvKiogSW5pdGlhbCB0aW1lIHN0cmluZy4gQWNjZXB0ZWQ6IFwiOTo0NSBhbVwiLCBcIjA5OjQ1IGFtXCIsIFwiMjE6NDVcIiAqL1xuICBASW5wdXQoKSB2YWx1ZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBCdWlsdC1pbiB0aGVtZSBwcmVzZXQuXG4gICAqICdsaWdodCcgKGRlZmF1bHQpIOKAlCB3aGl0ZSBiYWNrZ3JvdW5kLCBkYXJrIHRleHQuXG4gICAqICdkYXJrJyDigJQgZGFyayBzdXJmYWNlLCBsaWdodCB0ZXh0LlxuICAgKiBGb3IgZnVsbCBjb250cm9sLCBvdmVycmlkZSBDU1MgY3VzdG9tIHByb3BlcnRpZXMgaW5zdGVhZDpcbiAgICogICAtLXRwLWJnLCAtLXRwLXNlbGVjdGlvbi1iZywgLS10cC10ZXh0LWNvbG9yLCAtLXRwLXNlcGFyYXRvci1jb2xvcixcbiAgICogICAtLXRwLXNlbGVjdGlvbi1yYWRpdXMsIC0tdHAtcGlja2VyLXJhZGl1cywgLS10cC1waWNrZXItcGFkZGluZ1xuICAgKi9cbiAgQElucHV0KCkgdGhlbWU6IFRpbWVwaWNrZXJUaGVtZSA9ICdsaWdodCc7XG5cbiAgLyoqXG4gICAqIExheW91dCAmIHR5cG9ncmFwaHkgY29uZmlndXJhdGlvbi5cbiAgICogUGFydGlhbCDigJQgb25seSBzcGVjaWZ5IHRoZSB2YWx1ZXMgeW91IHdhbnQgdG8gY2hhbmdlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBbY29uZmlnXT1cInsgaXRlbUhlaWdodDogNTYsIGZvbnRTaXplU2VsZWN0ZWQ6IDI0LCBvcGFjaXR5TmVhcjogMC41IH1cIlxuICAgKi9cbiAgQElucHV0KCkgY29uZmlnOiBUaW1lcGlja2VyQ29uZmlnID0ge307XG5cbiAgLyoqIEVtaXRzIGZvcm1hdHRlZCB0aW1lIHN0cmluZyBvbiBldmVyeSBjaGFuZ2UgKi9cbiAgQE91dHB1dCgpIHRpbWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBob3VyczEyOiBzdHJpbmdbXSA9IFtdO1xuICBob3VyczI0OiBzdHJpbmdbXSA9IFtdO1xuICBtaW51dGVzOiBzdHJpbmdbXSA9IFtdO1xuICBwZXJpb2RzOiBzdHJpbmdbXSA9IFsnYW0nLCAncG0nXTtcblxuICBob3VySW5kZXggPSAwO1xuICBtaW51dGVJbmRleCA9IDA7XG4gIHBlcmlvZEluZGV4ID0gMDtcblxuICBwcml2YXRlIG9uQ2hhbmdlOiAodjogc3RyaW5nKSA9PiB2b2lkID0gKCkgPT4ge307XG4gIHByaXZhdGUgb25Ub3VjaGVkOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuYnVpbGRBcnJheXMoKTtcbiAgICB0aGlzLnBhcnNlVmFsdWUodGhpcy52YWx1ZSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ2Zvcm1hdCddICYmICFjaGFuZ2VzWydmb3JtYXQnXS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5idWlsZEFycmF5cygpO1xuICAgICAgdGhpcy5wYXJzZVZhbHVlKHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1sndmFsdWUnXSAmJiAhY2hhbmdlc1sndmFsdWUnXS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5wYXJzZVZhbHVlKHRoaXMudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBNZXJnZWQgY29uZmlnIOKAlCBERUZBVUxUX0NPTkZJRyArIGNvbnN1bWVyIG92ZXJyaWRlcyAqL1xuICBnZXQgbWVyZ2VkQ29uZmlnKCk6IFJlcXVpcmVkPFRpbWVwaWNrZXJDb25maWc+IHtcbiAgICByZXR1cm4geyAuLi5ERUZBVUxUX0NPTkZJRywgLi4udGhpcy5jb25maWcgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgdmFyaWFibGVzIGluamVjdGVkIG9udG8gdGhlIHJvb3QgZWxlbWVudC5cbiAgICogLS10cC1pdGVtLWhlaWdodCBkcml2ZXMgdGhlIHNlbGVjdGlvbi1ib3ggaGVpZ2h0IGFuZCBzZXBhcmF0b3IgbGluZS1oZWlnaHRcbiAgICogd2l0aG91dCByZXF1aXJpbmcgdGhlIFNDU1MgdG8ga25vdyB0aGUgcnVudGltZSB2YWx1ZS5cbiAgICovXG4gIGdldCByb290VmFycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICByZXR1cm4geyAnLS10cC1pdGVtLWhlaWdodCc6IGAke3RoaXMubWVyZ2VkQ29uZmlnLml0ZW1IZWlnaHR9cHhgIH07XG4gIH1cblxuICBnZXQgaG91ckl0ZW1zKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtYXQgPT09ICcxMmgnID8gdGhpcy5ob3VyczEyIDogdGhpcy5ob3VyczI0O1xuICB9XG5cbiAgLy8g4pSA4pSAIENvbnRyb2xWYWx1ZUFjY2Vzc29yIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIHdyaXRlVmFsdWUodmFsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMucGFyc2VWYWx1ZSh2YWwpO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHY6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIC8vIOKUgOKUgCBIYW5kbGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBvbkhvdXJDaGFuZ2UoaW5kZXg6IG51bWJlcik6IHZvaWQgeyB0aGlzLmhvdXJJbmRleCA9IGluZGV4OyB0aGlzLmVtaXQoKTsgfVxuICBvbk1pbnV0ZUNoYW5nZShpbmRleDogbnVtYmVyKTogdm9pZCB7IHRoaXMubWludXRlSW5kZXggPSBpbmRleDsgdGhpcy5lbWl0KCk7IH1cbiAgb25QZXJpb2RDaGFuZ2UoaW5kZXg6IG51bWJlcik6IHZvaWQgeyB0aGlzLnBlcmlvZEluZGV4ID0gaW5kZXg7IHRoaXMuZW1pdCgpOyB9XG5cbiAgLy8g4pSA4pSAIEludGVybmFscyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBwcml2YXRlIGJ1aWxkQXJyYXlzKCk6IHZvaWQge1xuICAgIHRoaXMuaG91cnMxMiA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEyIH0sIChfLCBpKSA9PiBTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDIsICcwJykpO1xuICAgIHRoaXMuaG91cnMyNCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDI0IH0sIChfLCBpKSA9PiBTdHJpbmcoaSkucGFkU3RhcnQoMiwgJzAnKSk7XG4gICAgdGhpcy5taW51dGVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNjAgfSwgKF8sIGkpID0+IFN0cmluZyhpKS5wYWRTdGFydCgyLCAnMCcpKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VWYWx1ZSh2YWw6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdmFsKSB7IHRoaXMuc2V0RGVmYXVsdHMoKTsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBub3JtYWxpemVkID0gdmFsLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IG1hdGNoID0gbm9ybWFsaXplZC5tYXRjaCgvXihcXGR7MSwyfSk6KFxcZHsyfSkoPzpcXHMqKGFtfHBtKSk/JC8pO1xuICAgIGlmICghbWF0Y2gpIHsgdGhpcy5zZXREZWZhdWx0cygpOyByZXR1cm47IH1cblxuICAgIGxldCBoID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICBjb25zdCBtID0gcGFyc2VJbnQobWF0Y2hbMl0sIDEwKTtcbiAgICBjb25zdCBwZXJpb2QgPSBtYXRjaFszXSBhcyAnYW0nIHwgJ3BtJyB8IHVuZGVmaW5lZDtcblxuICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gJzEyaCcpIHtcbiAgICAgIGlmIChwZXJpb2QpIHtcbiAgICAgICAgdGhpcy5wZXJpb2RJbmRleCA9IHBlcmlvZCA9PT0gJ2FtJyA/IDAgOiAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGggPj0gMTIpIHsgdGhpcy5wZXJpb2RJbmRleCA9IDE7IGlmIChoID4gMTIpIGggLT0gMTI7IH1cbiAgICAgICAgZWxzZSB7IHRoaXMucGVyaW9kSW5kZXggPSAwOyBpZiAoaCA9PT0gMCkgaCA9IDEyOyB9XG4gICAgICB9XG4gICAgICB0aGlzLmhvdXJJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKChoIC0gMSArIDEyKSAlIDEyLCAxMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGVyaW9kID09PSAncG0nICYmIGggPCAxMikgaCArPSAxMjtcbiAgICAgIGVsc2UgaWYgKHBlcmlvZCA9PT0gJ2FtJyAmJiBoID09PSAxMikgaCA9IDA7XG4gICAgICB0aGlzLmhvdXJJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKGgsIDIzKSk7XG4gICAgfVxuXG4gICAgdGhpcy5taW51dGVJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKG0sIDU5KSk7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIHNldERlZmF1bHRzKCk6IHZvaWQge1xuICAgIHRoaXMuaG91ckluZGV4ID0gdGhpcy5mb3JtYXQgPT09ICcxMmgnID8gOCA6IDk7XG4gICAgdGhpcy5taW51dGVJbmRleCA9IDA7XG4gICAgdGhpcy5wZXJpb2RJbmRleCA9IDA7XG4gIH1cblxuICBwcml2YXRlIGVtaXQoKTogdm9pZCB7XG4gICAgY29uc3QgdGltZSA9IHRoaXMuYnVpbGRUaW1lU3RyaW5nKCk7XG4gICAgdGhpcy50aW1lQ2hhbmdlLmVtaXQodGltZSk7XG4gICAgdGhpcy5vbkNoYW5nZSh0aW1lKTtcbiAgfVxuXG4gIGJ1aWxkVGltZVN0cmluZygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGggPSB0aGlzLmhvdXJJdGVtc1t0aGlzLmhvdXJJbmRleF07XG4gICAgY29uc3QgbSA9IHRoaXMubWludXRlc1t0aGlzLm1pbnV0ZUluZGV4XTtcbiAgICBpZiAodGhpcy5mb3JtYXQgPT09ICcxMmgnKSByZXR1cm4gYCR7aH06JHttfSAke3RoaXMucGVyaW9kc1t0aGlzLnBlcmlvZEluZGV4XX1gO1xuICAgIHJldHVybiBgJHtofToke219YDtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cInRwLXJvb3RcIlxuICAgICBbY2xhc3MudHAtZGFya109XCJ0aGVtZSA9PT0gJ2RhcmsnXCJcbiAgICAgW25nU3R5bGVdPVwicm9vdFZhcnNcIj5cblxuICA8IS0tIFNlbGVjdGlvbiBoaWdobGlnaHQgYm94IOKAlCBoZWlnaHQgdHJhY2tzIGl0ZW1IZWlnaHQgdmlhIC0tdHAtaXRlbS1oZWlnaHQgLS0+XG4gIDxkaXYgY2xhc3M9XCJ0cC1zZWxlY3Rpb24tYm94XCI+PC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cInRwLWNvbHVtbnNcIj5cbiAgICA8IS0tIEhvdXJzIGNvbHVtbiAtLT5cbiAgICA8dHAtc2Nyb2xsLWNvbHVtblxuICAgICAgW2l0ZW1zXT1cImhvdXJJdGVtc1wiXG4gICAgICBbc2VsZWN0ZWRJbmRleF09XCJob3VySW5kZXhcIlxuICAgICAgW2NvbmZpZ109XCJtZXJnZWRDb25maWdcIlxuICAgICAgKHNlbGVjdGVkSW5kZXhDaGFuZ2UpPVwib25Ib3VyQ2hhbmdlKCRldmVudClcIlxuICAgICAgY2xhc3M9XCJ0cC1jb2wtbnVtYmVyXCJcbiAgICA+PC90cC1zY3JvbGwtY29sdW1uPlxuXG4gICAgPCEtLSBDb2xvbiBzZXBhcmF0b3IgLS0+XG4gICAgPGRpdiBjbGFzcz1cInRwLXNlcGFyYXRvclwiPjo8L2Rpdj5cblxuICAgIDwhLS0gTWludXRlcyBjb2x1bW4gLS0+XG4gICAgPHRwLXNjcm9sbC1jb2x1bW5cbiAgICAgIFtpdGVtc109XCJtaW51dGVzXCJcbiAgICAgIFtzZWxlY3RlZEluZGV4XT1cIm1pbnV0ZUluZGV4XCJcbiAgICAgIFtjb25maWddPVwibWVyZ2VkQ29uZmlnXCJcbiAgICAgIChzZWxlY3RlZEluZGV4Q2hhbmdlKT1cIm9uTWludXRlQ2hhbmdlKCRldmVudClcIlxuICAgICAgY2xhc3M9XCJ0cC1jb2wtbnVtYmVyXCJcbiAgICA+PC90cC1zY3JvbGwtY29sdW1uPlxuXG4gICAgPCEtLSBBTS9QTSBjb2x1bW4g4oCUIG9ubHkgaW4gMTJoIGZvcm1hdCAtLT5cbiAgICA8dHAtc2Nyb2xsLWNvbHVtblxuICAgICAgKm5nSWY9XCJmb3JtYXQgPT09ICcxMmgnXCJcbiAgICAgIFtpdGVtc109XCJwZXJpb2RzXCJcbiAgICAgIFtzZWxlY3RlZEluZGV4XT1cInBlcmlvZEluZGV4XCJcbiAgICAgIFtjb25maWddPVwibWVyZ2VkQ29uZmlnXCJcbiAgICAgIChzZWxlY3RlZEluZGV4Q2hhbmdlKT1cIm9uUGVyaW9kQ2hhbmdlKCRldmVudClcIlxuICAgICAgY2xhc3M9XCJ0cC1jb2wtcGVyaW9kXCJcbiAgICA+PC90cC1zY3JvbGwtY29sdW1uPlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19