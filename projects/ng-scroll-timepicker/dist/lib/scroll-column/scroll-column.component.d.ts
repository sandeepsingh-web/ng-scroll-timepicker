import { EventEmitter, OnChanges, SimpleChanges, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { TimepickerConfig } from '../timepicker/timepicker.config';
import * as i0 from "@angular/core";
export declare class ScrollColumnComponent implements AfterViewInit, OnChanges, OnDestroy {
    private ngZone;
    private cdr;
    items: string[];
    selectedIndex: number;
    config: Required<TimepickerConfig>;
    selectedIndexChange: EventEmitter<number>;
    scrollEl: ElementRef<HTMLElement>;
    /** Fractional center position — drives live opacity/size during scroll */
    currentCenter: number;
    private snapTimer;
    private wheelHandler;
    private wheelThrottled;
    private touchStartY;
    private touchStartScrollTop;
    private isTouching;
    /** ms between wheel steps */
    private readonly WHEEL_INTERVAL;
    /** Damping on touch drag (0.55 = 55% of finger travel) */
    private readonly TOUCH_DAMPING;
    constructor(ngZone: NgZone, cdr: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    onScroll(): void;
    onTouchStart(e: TouchEvent): void;
    onTouchMove(e: TouchEvent): void;
    onTouchEnd(): void;
    selectItem(index: number): void;
    getItemOpacity(index: number): number;
    getItemFontSize(index: number): string;
    getItemFontWeight(index: number): string;
    get containerHeight(): number;
    get paddingSize(): number;
    private scheduleSnap;
    private scrollToIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollColumnComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ScrollColumnComponent, "tp-scroll-column", never, { "items": { "alias": "items"; "required": false; }; "selectedIndex": { "alias": "selectedIndex"; "required": false; }; "config": { "alias": "config"; "required": false; }; }, { "selectedIndexChange": "selectedIndexChange"; }, never, never, true, never>;
}
//# sourceMappingURL=scroll-column.component.d.ts.map