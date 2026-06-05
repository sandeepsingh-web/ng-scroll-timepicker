# ng-scroll-timepicker

A smooth, scroll-based time picker Angular component with Bootstrap 5 styling.
Supports 12h / 24h formats, reactive forms, and touch/mouse/keyboard scroll.

## Install

```bash
npm install ng-scroll-timepicker bootstrap
```

Add Bootstrap to your `angular.json` styles:

```json
"styles": ["node_modules/bootstrap/dist/css/bootstrap.min.css", "src/styles.scss"]
```

## Usage

### Module-based app

```typescript
import { NgTimepickerModule } from 'ng-scroll-timepicker';

@NgModule({ imports: [NgTimepickerModule] })
export class AppModule {}
```

### Standalone / Angular 18

```typescript
import { NgTimepickerComponent } from 'ng-scroll-timepicker';

@Component({
  imports: [NgTimepickerComponent],
  ...
})
```

### Template

```html
<!-- 12h format with output binding -->
<ng-scroll-timepicker
  format="12h"
  value="09:45 am"
  (timeChange)="onTime($event)">
</ng-scroll-timepicker>

<!-- 24h format -->
<ng-scroll-timepicker
  format="24h"
  value="14:30"
  (timeChange)="onTime($event)">
</ng-scroll-timepicker>

<!-- Reactive forms -->
<ng-scroll-timepicker format="12h" [formControl]="ctrl"></ng-scroll-timepicker>

<!-- Template-driven forms -->
<ng-scroll-timepicker format="12h" [(ngModel)]="myTime"></ng-scroll-timepicker>
```

## API

### Inputs

| Input    | Type                | Default | Description                                           |
|----------|---------------------|---------|-------------------------------------------------------|
| `format` | `'12h' \| '24h'`   | `'12h'` | Time format. `'12h'` shows am/pm column.              |
| `value`  | `string`            | `''`    | Initial time. E.g. `"09:45 am"` or `"14:30"`.        |

### Outputs

| Output       | Type                    | Description                                     |
|--------------|-------------------------|-------------------------------------------------|
| `timeChange` | `EventEmitter<string>`  | Emits formatted string on every selection change. |

### Output format

| Format | Example output |
|--------|----------------|
| `12h`  | `"09:45 am"`, `"12:30 pm"` |
| `24h`  | `"09:45"`, `"21:30"` |

## Build the library

```bash
npm run build:lib
```

Output is in `dist/ng-scroll-timepicker/` — ready to publish to npm.

## Run the demo app

```bash
npm install
npm start
```

## Features

- Smooth scroll with mouse wheel, touch drag, and click-to-select
- Visual fade and scale effect — center item is bold and full-size, outer items fade
- Highlights selected row with a rounded-rect indicator across all columns
- `ControlValueAccessor` — works with `[(ngModel)]` and reactive `FormControl`
- Standalone component (Angular 18) + `NgModule` export for compatibility
- Zero external dependencies beyond Angular and Bootstrap 5
