import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DEFAULT_CONFIG } from '../timepicker/timepicker.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ScrollColumnComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWNvbHVtbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Njcm9sbC1jb2x1bW4vc2Nyb2xsLWNvbHVtbi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9zcmMvbGliL3Njcm9sbC1jb2x1bW4vc2Nyb2xsLWNvbHVtbi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUdaLFNBQVMsRUFJVCx1QkFBdUIsR0FHeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxjQUFjLEVBQW9CLE1BQU0saUNBQWlDLENBQUM7OztBQVVuRixNQUFNLE9BQU8scUJBQXFCO0lBdUJoQyxZQUFvQixNQUFjLEVBQVUsR0FBc0I7UUFBOUMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBdEJ6RCxVQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3JCLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLFdBQU0sR0FBK0IsRUFBRSxHQUFHLGNBQWMsRUFBRSxDQUFDO1FBQzFELHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFJM0QsMEVBQTBFO1FBQzFFLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO1FBRVYsY0FBUyxHQUF5QyxJQUFJLENBQUM7UUFFdkQsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDdkIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsd0JBQW1CLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFM0IsNkJBQTZCO1FBQ1osbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDckMsMERBQTBEO1FBQ3pDLGtCQUFhLEdBQUcsSUFBSSxDQUFD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LE1BQU07c0JBQWQsS0FBSztnQkFDSSxtQkFBbUI7c0JBQTVCLE1BQU07Z0JBRWdCLFFBQVE7c0JBQTlCLFNBQVM7dUJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgREVGQVVMVF9DT05GSUcsIFRpbWVwaWNrZXJDb25maWcgfSBmcm9tICcuLi90aW1lcGlja2VyL3RpbWVwaWNrZXIuY29uZmlnJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndHAtc2Nyb2xsLWNvbHVtbicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICB0ZW1wbGF0ZVVybDogJy4vc2Nyb2xsLWNvbHVtbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Njcm9sbC1jb2x1bW4uY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbENvbHVtbkNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgaXRlbXM6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIHNlbGVjdGVkSW5kZXggPSAwO1xuICBASW5wdXQoKSBjb25maWc6IFJlcXVpcmVkPFRpbWVwaWNrZXJDb25maWc+ID0geyAuLi5ERUZBVUxUX0NPTkZJRyB9O1xuICBAT3V0cHV0KCkgc2VsZWN0ZWRJbmRleENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ3Njcm9sbEVsJykgc2Nyb2xsRWwhOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogRnJhY3Rpb25hbCBjZW50ZXIgcG9zaXRpb24g4oCUIGRyaXZlcyBsaXZlIG9wYWNpdHkvc2l6ZSBkdXJpbmcgc2Nyb2xsICovXG4gIGN1cnJlbnRDZW50ZXIgPSAwO1xuXG4gIHByaXZhdGUgc25hcFRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHdoZWVsSGFuZGxlciE6IChlOiBXaGVlbEV2ZW50KSA9PiB2b2lkO1xuICBwcml2YXRlIHdoZWVsVGhyb3R0bGVkID0gZmFsc2U7XG4gIHByaXZhdGUgdG91Y2hTdGFydFkgPSAwO1xuICBwcml2YXRlIHRvdWNoU3RhcnRTY3JvbGxUb3AgPSAwO1xuICBwcml2YXRlIGlzVG91Y2hpbmcgPSBmYWxzZTtcblxuICAvKiogbXMgYmV0d2VlbiB3aGVlbCBzdGVwcyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IFdIRUVMX0lOVEVSVkFMID0gNTA7XG4gIC8qKiBEYW1waW5nIG9uIHRvdWNoIGRyYWcgKDAuNTUgPSA1NSUgb2YgZmluZ2VyIHRyYXZlbCkgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBUT1VDSF9EQU1QSU5HID0gMC41NTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLCBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudENlbnRlciA9IHRoaXMuc2VsZWN0ZWRJbmRleDtcbiAgICB0aGlzLnNjcm9sbFRvSW5kZXgodGhpcy5zZWxlY3RlZEluZGV4LCBmYWxzZSk7XG5cbiAgICB0aGlzLndoZWVsSGFuZGxlciA9IChlOiBXaGVlbEV2ZW50KSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAodGhpcy53aGVlbFRocm90dGxlZCkgcmV0dXJuO1xuICAgICAgdGhpcy53aGVlbFRocm90dGxlZCA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy53aGVlbFRocm90dGxlZCA9IGZhbHNlOyB9LCB0aGlzLldIRUVMX0lOVEVSVkFMKTtcblxuICAgICAgY29uc3QgZGVsdGEgPSBlLmRlbHRhWSA+IDAgPyAxIDogLTE7XG4gICAgICBjb25zdCBuZXh0ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4odGhpcy5zZWxlY3RlZEluZGV4ICsgZGVsdGEsIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSkpO1xuICAgICAgaWYgKG5leHQgIT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBuZXh0O1xuICAgICAgICB0aGlzLmN1cnJlbnRDZW50ZXIgPSBuZXh0O1xuICAgICAgICB0aGlzLnNjcm9sbFRvSW5kZXgobmV4dCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleENoYW5nZS5lbWl0KG5leHQpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxFbC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy53aGVlbEhhbmRsZXIsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3NlbGVjdGVkSW5kZXgnXSAmJiAhY2hhbmdlc1snc2VsZWN0ZWRJbmRleCddLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRDZW50ZXIgPSB0aGlzLnNlbGVjdGVkSW5kZXg7XG4gICAgICB0aGlzLnNjcm9sbFRvSW5kZXgodGhpcy5zZWxlY3RlZEluZGV4LCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2l0ZW1zJ10gJiYgIWNoYW5nZXNbJ2l0ZW1zJ10uZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRDZW50ZXIgPSB0aGlzLnNlbGVjdGVkSW5kZXg7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9JbmRleCh0aGlzLnNlbGVjdGVkSW5kZXgsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zY3JvbGxFbD8ubmF0aXZlRWxlbWVudCkge1xuICAgICAgdGhpcy5zY3JvbGxFbC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy53aGVlbEhhbmRsZXIpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zbmFwVGltZXIpIGNsZWFyVGltZW91dCh0aGlzLnNuYXBUaW1lcik7XG4gIH1cblxuICBvblNjcm9sbCgpOiB2b2lkIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuc2Nyb2xsRWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmN1cnJlbnRDZW50ZXIgPSBlbC5zY3JvbGxUb3AgLyB0aGlzLmNvbmZpZy5pdGVtSGVpZ2h0O1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgaWYgKHRoaXMuaXNUb3VjaGluZykgcmV0dXJuO1xuICAgIHRoaXMuc2NoZWR1bGVTbmFwKCk7XG4gIH1cblxuICBvblRvdWNoU3RhcnQoZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuaXNUb3VjaGluZyA9IHRydWU7XG4gICAgdGhpcy50b3VjaFN0YXJ0WSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuICAgIHRoaXMudG91Y2hTdGFydFNjcm9sbFRvcCA9IHRoaXMuc2Nyb2xsRWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3A7XG4gICAgaWYgKHRoaXMuc25hcFRpbWVyKSBjbGVhclRpbWVvdXQodGhpcy5zbmFwVGltZXIpO1xuICB9XG5cbiAgb25Ub3VjaE1vdmUoZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBkeSA9ICh0aGlzLnRvdWNoU3RhcnRZIC0gZS50b3VjaGVzWzBdLmNsaWVudFkpICogdGhpcy5UT1VDSF9EQU1QSU5HO1xuICAgIHRoaXMuc2Nyb2xsRWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLnRvdWNoU3RhcnRTY3JvbGxUb3AgKyBkeTtcbiAgfVxuXG4gIG9uVG91Y2hFbmQoKTogdm9pZCB7XG4gICAgdGhpcy5pc1RvdWNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zY2hlZHVsZVNuYXAoODApO1xuICB9XG5cbiAgc2VsZWN0SXRlbShpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5jdXJyZW50Q2VudGVyID0gaW5kZXg7XG4gICAgdGhpcy5zY3JvbGxUb0luZGV4KGluZGV4LCB0cnVlKTtcbiAgICB0aGlzLnNlbGVjdGVkSW5kZXhDaGFuZ2UuZW1pdChpbmRleCk7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXRJdGVtT3BhY2l0eShpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCB7IG9wYWNpdHlOZWFyLCBvcGFjaXR5RmFyLCBvcGFjaXR5SGlkZGVuIH0gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCBkaXN0ID0gTWF0aC5hYnMoaW5kZXggLSB0aGlzLmN1cnJlbnRDZW50ZXIpO1xuICAgIGlmIChkaXN0IDw9IDAuMykgcmV0dXJuIDE7XG4gICAgaWYgKGRpc3QgPD0gMS4zKSByZXR1cm4gb3BhY2l0eU5lYXI7XG4gICAgaWYgKGRpc3QgPD0gMi4zKSByZXR1cm4gb3BhY2l0eUZhcjtcbiAgICByZXR1cm4gb3BhY2l0eUhpZGRlbjtcbiAgfVxuXG4gIGdldEl0ZW1Gb250U2l6ZShpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IGZvbnRTaXplU2VsZWN0ZWQsIGZvbnRTaXplTmVhciwgZm9udFNpemVGYXIgfSA9IHRoaXMuY29uZmlnO1xuICAgIGNvbnN0IGRpc3QgPSBNYXRoLmFicyhpbmRleCAtIHRoaXMuY3VycmVudENlbnRlcik7XG4gICAgaWYgKGRpc3QgPD0gMC4zKSByZXR1cm4gYCR7Zm9udFNpemVTZWxlY3RlZH1weGA7XG4gICAgaWYgKGRpc3QgPD0gMS4zKSByZXR1cm4gYCR7Zm9udFNpemVOZWFyfXB4YDtcbiAgICByZXR1cm4gYCR7Zm9udFNpemVGYXJ9cHhgO1xuICB9XG5cbiAgZ2V0SXRlbUZvbnRXZWlnaHQoaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgZGlzdCA9IE1hdGguYWJzKGluZGV4IC0gTWF0aC5yb3VuZCh0aGlzLmN1cnJlbnRDZW50ZXIpKTtcbiAgICByZXR1cm4gZGlzdCA9PT0gMCA/ICc3MDAnIDogJzQwMCc7XG4gIH1cblxuICBnZXQgY29udGFpbmVySGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLnZpc2libGVJdGVtcyAqIHRoaXMuY29uZmlnLml0ZW1IZWlnaHQ7XG4gIH1cblxuICBnZXQgcGFkZGluZ1NpemUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmNvbmZpZy52aXNpYmxlSXRlbXMgLyAyKSAqIHRoaXMuY29uZmlnLml0ZW1IZWlnaHQ7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlU25hcChkZWxheSA9IDEyMCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNuYXBUaW1lcikgY2xlYXJUaW1lb3V0KHRoaXMuc25hcFRpbWVyKTtcbiAgICB0aGlzLnNuYXBUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZWwgPSB0aGlzLnNjcm9sbEVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBpbmRleCA9IE1hdGgucm91bmQoZWwuc2Nyb2xsVG9wIC8gdGhpcy5jb25maWcuaXRlbUhlaWdodCk7XG4gICAgICBjb25zdCBjbGFtcGVkID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oaW5kZXgsIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSkpO1xuICAgICAgdGhpcy5zY3JvbGxUb0luZGV4KGNsYW1wZWQsIHRydWUpO1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2VudGVyID0gY2xhbXBlZDtcbiAgICAgICAgaWYgKGNsYW1wZWQgIT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGNsYW1wZWQ7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4Q2hhbmdlLmVtaXQoY2xhbXBlZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICBwcml2YXRlIHNjcm9sbFRvSW5kZXgoaW5kZXg6IG51bWJlciwgYW5pbWF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5zY3JvbGxFbD8ubmF0aXZlRWxlbWVudDtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgZWwuc2Nyb2xsVG8oe1xuICAgICAgdG9wOiBpbmRleCAqIHRoaXMuY29uZmlnLml0ZW1IZWlnaHQsXG4gICAgICBiZWhhdmlvcjogYW5pbWF0ZSA/ICdzbW9vdGgnIDogJ2luc3RhbnQnLFxuICAgIH0pO1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwidHAtc2Nyb2xsLXdyYXBwZXJcIj5cbiAgPGRpdlxuICAgIGNsYXNzPVwidHAtc2Nyb2xsLWNvbnRhaW5lclwiXG4gICAgI3Njcm9sbEVsXG4gICAgW3N0eWxlLmhlaWdodC5weF09XCJjb250YWluZXJIZWlnaHRcIlxuICAgIChzY3JvbGwpPVwib25TY3JvbGwoKVwiXG4gICAgKHRvdWNoc3RhcnQpPVwib25Ub3VjaFN0YXJ0KCRldmVudClcIlxuICAgICh0b3VjaG1vdmUpPVwib25Ub3VjaE1vdmUoJGV2ZW50KVwiXG4gICAgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoKVwiXG4gID5cbiAgICA8ZGl2IGNsYXNzPVwidHAtc3BhY2VyXCIgW3N0eWxlLmhlaWdodC5weF09XCJwYWRkaW5nU2l6ZVwiPjwvZGl2PlxuXG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJ0cC1pdGVtXCJcbiAgICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIGl0ZW1zOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiY29uZmlnLml0ZW1IZWlnaHRcIlxuICAgICAgW3N0eWxlLm9wYWNpdHldPVwiZ2V0SXRlbU9wYWNpdHkoaSlcIlxuICAgICAgW3N0eWxlLmZvbnQtc2l6ZV09XCJnZXRJdGVtRm9udFNpemUoaSlcIlxuICAgICAgW3N0eWxlLmZvbnQtd2VpZ2h0XT1cImdldEl0ZW1Gb250V2VpZ2h0KGkpXCJcbiAgICAgIChjbGljayk9XCJzZWxlY3RJdGVtKGkpXCJcbiAgICA+XG4gICAgICB7eyBpdGVtIH19XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwidHAtc3BhY2VyXCIgW3N0eWxlLmhlaWdodC5weF09XCJwYWRkaW5nU2l6ZVwiPjwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19