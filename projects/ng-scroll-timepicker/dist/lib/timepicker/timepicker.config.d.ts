export interface TimepickerConfig {
    /** Row height in px. Affects scroll math. Default: 48 */
    itemHeight?: number;
    /** Number of visible rows in the scroll window. Default: 5 */
    visibleItems?: number;
    /** Font size (px) of the selected center item. Default: 22 */
    fontSizeSelected?: number;
    /** Font size (px) of items ±1 from center. Default: 18 */
    fontSizeNear?: number;
    /** Font size (px) of items ±2+ from center. Default: 15 */
    fontSizeFar?: number;
    /** Opacity of items ±1 from center. Default: 0.45 */
    opacityNear?: number;
    /** Opacity of items ±2 from center. Default: 0.2 */
    opacityFar?: number;
    /** Opacity of items ±3+ from center. Default: 0.08 */
    opacityHidden?: number;
}
export declare const DEFAULT_CONFIG: Required<TimepickerConfig>;
//# sourceMappingURL=timepicker.config.d.ts.map