import * as i0 from '@angular/core';
import { EventEmitter, Component, ChangeDetectionStrategy, Input, Output, ViewChild, forwardRef, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const DEFAULT_CONFIG = {
    itemHeight: 48,
    visibleItems: 5,
    fontSizeSelected: 22,
    fontSizeNear: 18,
    fontSizeFar: 15,
    opacityNear: 0.45,
    opacityFar: 0.2,
    opacityHidden: 0.08,
};

class ScrollColumnComponent {
    constructor(ngZone, cdr) {
        this.ngZone = ngZone;
        this.cdr = cdr;
        this.items = [];
        this.selectedIndex = 0;
        this.config = { ...DEFAULT_CONFIG };
        this.selectedIndexChange = new EventEmitter();
        /** Fractional center position — drives live opacity/size during scroll */
        this.currentCenter = 0;
        this.snapTimer = null;
        this.wheelThrottled = false;
        this.touchStartY = 0;
        this.touchStartScrollTop = 0;
        this.isTouching = false;
        /** ms between wheel steps */
        this.WHEEL_INTERVAL = 50;
        /** Damping on touch drag (0.55 = 55% of finger travel) */
        this.TOUCH_DAMPING = 0.55;
    }
    ngAfterViewInit() {
        this.currentCenter = this.selectedIndex;
        this.scrollToIndex(this.selectedIndex, false);
        this.wheelHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.wheelThrottled)
                return;
            this.wheelThrottled = true;
            setTimeout(() => { this.wheelThrottled = false; }, this.WHEEL_INTERVAL);
            const delta = e.deltaY > 0 ? 1 : -1;
            const next = Math.max(0, Math.min(this.selectedIndex + delta, this.items.length - 1));
            if (next !== this.selectedIndex) {
                this.selectedIndex = next;
                this.currentCenter = next;
                this.scrollToIndex(next, true);
                this.selectedIndexChange.emit(next);
                this.cdr.markForCheck();
            }
        };
        this.ngZone.runOutsideAngular(() => {
            this.scrollEl.nativeElement.addEventListener('wheel', this.wheelHandler, { passive: false });
        });
    }
    ngOnChanges(changes) {
        if (changes['selectedIndex'] && !changes['selectedIndex'].firstChange) {
            this.currentCenter = this.selectedIndex;
            this.scrollToIndex(this.selectedIndex, true);
        }
        if (changes['items'] && !changes['items'].firstChange) {
            setTimeout(() => {
                this.currentCenter = this.selectedIndex;
                this.scrollToIndex(this.selectedIndex, false);
                this.cdr.markForCheck();
            }, 0);
        }
    }
    ngOnDestroy() {
        if (this.scrollEl?.nativeElement) {
            this.scrollEl.nativeElement.removeEventListener('wheel', this.wheelHandler);
        }
        if (this.snapTimer)
            clearTimeout(this.snapTimer);
    }
    onScroll() {
        const el = this.scrollEl.nativeElement;
        this.currentCenter = el.scrollTop / this.config.itemHeight;
        this.cdr.markForCheck();
        if (this.isTouching)
            return;
        this.scheduleSnap();
    }
    onTouchStart(e) {
        this.isTouching = true;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartScrollTop = this.scrollEl.nativeElement.scrollTop;
        if (this.snapTimer)
            clearTimeout(this.snapTimer);
    }
    onTouchMove(e) {
        e.preventDefault();
        const dy = (this.touchStartY - e.touches[0].clientY) * this.TOUCH_DAMPING;
        this.scrollEl.nativeElement.scrollTop = this.touchStartScrollTop + dy;
    }
    onTouchEnd() {
        this.isTouching = false;
        this.scheduleSnap(80);
    }
    selectItem(index) {
        this.selectedIndex = index;
        this.currentCenter = index;
        this.scrollToIndex(index, true);
        this.selectedIndexChange.emit(index);
        this.cdr.markForCheck();
    }
    getItemOpacity(index) {
        const { opacityNear, opacityFar, opacityHidden } = this.config;
        const dist = Math.abs(index - this.currentCenter);
        if (dist <= 0.3)
            return 1;
        if (dist <= 1.3)
            return opacityNear;
        if (dist <= 2.3)
            return opacityFar;
        return opacityHidden;
    }
    getItemFontSize(index) {
        const { fontSizeSelected, fontSizeNear, fontSizeFar } = this.config;
        const dist = Math.abs(index - this.currentCenter);
        if (dist <= 0.3)
            return `${fontSizeSelected}px`;
        if (dist <= 1.3)
            return `${fontSizeNear}px`;
        return `${fontSizeFar}px`;
    }
    getItemFontWeight(index) {
        const dist = Math.abs(index - Math.round(this.currentCenter));
        return dist === 0 ? '700' : '400';
    }
    get containerHeight() {
        return this.config.visibleItems * this.config.itemHeight;
    }
    get paddingSize() {
        return Math.floor(this.config.visibleItems / 2) * this.config.itemHeight;
    }
    scheduleSnap(delay = 120) {
        if (this.snapTimer)
            clearTimeout(this.snapTimer);
        this.snapTimer = setTimeout(() => {
            const el = this.scrollEl.nativeElement;
            const index = Math.round(el.scrollTop / this.config.itemHeight);
            const clamped = Math.max(0, Math.min(index, this.items.length - 1));
            this.scrollToIndex(clamped, true);
            this.ngZone.run(() => {
                this.currentCenter = clamped;
                if (clamped !== this.selectedIndex) {
                    this.selectedIndex = clamped;
                    this.selectedIndexChange.emit(clamped);
                }
                this.cdr.markForCheck();
            });
        }, delay);
    }
    scrollToIndex(index, animate) {
        const el = this.scrollEl?.nativeElement;
        if (!el)
            return;
        el.scrollTo({
            top: index * this.config.itemHeight,
            behavior: animate ? 'smooth' : 'instant',
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: ScrollColumnComponent, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.14", type: ScrollColumnComponent, isStandalone: true, selector: "tp-scroll-column", inputs: { items: "items", selectedIndex: "selectedIndex", config: "config" }, outputs: { selectedIndexChange: "selectedIndexChange" }, viewQueries: [{ propertyName: "scrollEl", first: true, predicate: ["scrollEl"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"tp-scroll-wrapper\">\n  <div\n    class=\"tp-scroll-container\"\n    #scrollEl\n    [style.height.px]=\"containerHeight\"\n    (scroll)=\"onScroll()\"\n    (touchstart)=\"onTouchStart($event)\"\n    (touchmove)=\"onTouchMove($event)\"\n    (touchend)=\"onTouchEnd()\"\n  >\n    <div class=\"tp-spacer\" [style.height.px]=\"paddingSize\"></div>\n\n    <div\n      class=\"tp-item\"\n      *ngFor=\"let item of items; let i = index\"\n      [style.height.px]=\"config.itemHeight\"\n      [style.opacity]=\"getItemOpacity(i)\"\n      [style.font-size]=\"getItemFontSize(i)\"\n      [style.font-weight]=\"getItemFontWeight(i)\"\n      (click)=\"selectItem(i)\"\n    >\n      {{ item }}\n    </div>\n\n    <div class=\"tp-spacer\" [style.height.px]=\"paddingSize\"></div>\n  </div>\n</div>\n", styles: [".tp-scroll-wrapper{position:relative;display:flex;flex-direction:column;align-items:center}.tp-scroll-container{overflow-y:scroll;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;overscroll-behavior:contain}.tp-scroll-container::-webkit-scrollbar{display:none}.tp-spacer{flex-shrink:0;pointer-events:none}.tp-item{display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-user-select:none;user-select:none;transition:opacity .08s ease,font-size .08s ease;letter-spacing:.01em;color:var(--tp-text-color, #1a1a1a);min-width:56px;padding:0 4px}.tp-item:hover{opacity:1!important}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: ScrollColumnComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tp-scroll-column', standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"tp-scroll-wrapper\">\n  <div\n    class=\"tp-scroll-container\"\n    #scrollEl\n    [style.height.px]=\"containerHeight\"\n    (scroll)=\"onScroll()\"\n    (touchstart)=\"onTouchStart($event)\"\n    (touchmove)=\"onTouchMove($event)\"\n    (touchend)=\"onTouchEnd()\"\n  >\n    <div class=\"tp-spacer\" [style.height.px]=\"paddingSize\"></div>\n\n    <div\n      class=\"tp-item\"\n      *ngFor=\"let item of items; let i = index\"\n      [style.height.px]=\"config.itemHeight\"\n      [style.opacity]=\"getItemOpacity(i)\"\n      [style.font-size]=\"getItemFontSize(i)\"\n      [style.font-weight]=\"getItemFontWeight(i)\"\n      (click)=\"selectItem(i)\"\n    >\n      {{ item }}\n    </div>\n\n    <div class=\"tp-spacer\" [style.height.px]=\"paddingSize\"></div>\n  </div>\n</div>\n", styles: [".tp-scroll-wrapper{position:relative;display:flex;flex-direction:column;align-items:center}.tp-scroll-container{overflow-y:scroll;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;overscroll-behavior:contain}.tp-scroll-container::-webkit-scrollbar{display:none}.tp-spacer{flex-shrink:0;pointer-events:none}.tp-item{display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-user-select:none;user-select:none;transition:opacity .08s ease,font-size .08s ease;letter-spacing:.01em;color:var(--tp-text-color, #1a1a1a);min-width:56px;padding:0 4px}.tp-item:hover{opacity:1!important}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }], propDecorators: { items: [{
                type: Input
            }], selectedIndex: [{
                type: Input
            }], config: [{
                type: Input
            }], selectedIndexChange: [{
                type: Output
            }], scrollEl: [{
                type: ViewChild,
                args: ['scrollEl']
            }] } });

class NgTimepickerComponent {
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

class NgTimepickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: NgTimepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.14", ngImport: i0, type: NgTimepickerModule, imports: [NgTimepickerComponent, ScrollColumnComponent], exports: [NgTimepickerComponent, ScrollColumnComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: NgTimepickerModule, imports: [NgTimepickerComponent, ScrollColumnComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: NgTimepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NgTimepickerComponent, ScrollColumnComponent],
                    exports: [NgTimepickerComponent, ScrollColumnComponent],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { DEFAULT_CONFIG, NgTimepickerComponent, NgTimepickerModule, ScrollColumnComponent };
//# sourceMappingURL=ng-scroll-timepicker.mjs.map
