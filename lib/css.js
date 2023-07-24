export const isCSSFontFaceRule = (rule) => rule.type === CSSRule.FONT_FACE_RULE;
export const isInline = (styles) => styles.displayOutside === 'inline' || styles.display.startsWith('inline-');
export const isPositioned = (styles) => styles.position !== 'static';
export const isInFlow = (styles) => styles.float !== 'none' && styles.position !== 'absolute' && styles.position !== 'fixed';
export const isTransparent = (color) => color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
export const hasUniformBorder = (styles) => parseFloat(styles.borderTopWidth) !== 0 &&
    styles.borderTopStyle !== 'none' &&
    styles.borderTopStyle !== 'inset' &&
    styles.borderTopStyle !== 'outset' &&
    !isTransparent(styles.borderTopColor) &&
    // Cannot use border property directly as in Firefox those are empty strings.
    // Need to get the specific border properties from the specific sides.
    // https://stackoverflow.com/questions/41696063/getcomputedstyle-returns-empty-strings-on-ff-when-instead-crome-returns-a-comp
    styles.borderTopWidth === styles.borderLeftWidth &&
    styles.borderTopWidth === styles.borderRightWidth &&
    styles.borderTopWidth === styles.borderBottomWidth &&
    styles.borderTopColor === styles.borderLeftColor &&
    styles.borderTopColor === styles.borderRightColor &&
    styles.borderTopColor === styles.borderBottomColor &&
    styles.borderTopStyle === styles.borderLeftStyle &&
    styles.borderTopStyle === styles.borderRightStyle &&
    styles.borderTopStyle === styles.borderBottomStyle;
/** The 4 sides of a box. */
const SIDES = ['top', 'bottom', 'right', 'left'];
/** Whether the given side is a horizontal side. */
export const isHorizontal = (side) => side === 'bottom' || side === 'top';
/**
 * The two corners for each side, in order of lower coordinate to higher coordinate.
 */
const CORNERS = {
    top: ['left', 'right'],
    bottom: ['left', 'right'],
    left: ['top', 'bottom'],
    right: ['top', 'bottom'],
};
/**
 * Returns the (elliptic) border radii for a given side.
 * For example, for the top side it will return the horizontal top-left and the horizontal top-right border radii.
 */
export function getBorderRadiiForSide(side, styles, bounds) {
    var _a, _b, _c, _d;
    const [horizontalStyle1, verticalStyle1] = styles
        .getPropertyValue(isHorizontal(side)
        ? `border-${side}-${CORNERS[side][0]}-radius`
        : `border-${CORNERS[side][0]}-${side}-radius`)
        .split(' ');
    const [horizontalStyle2, verticalStyle2] = styles
        .getPropertyValue(isHorizontal(side)
        ? `border-${side}-${CORNERS[side][1]}-radius`
        : `border-${CORNERS[side][1]}-${side}-radius`)
        .split(' ');
    if (isHorizontal(side)) {
        return [
            (_a = parseCSSLength(horizontalStyle1 || '0px', bounds.width)) !== null && _a !== void 0 ? _a : 0,
            (_b = parseCSSLength(horizontalStyle2 || '0px', bounds.width)) !== null && _b !== void 0 ? _b : 0,
        ];
    }
    return [
        (_c = parseCSSLength(verticalStyle1 || horizontalStyle1 || '0px', bounds.height)) !== null && _c !== void 0 ? _c : 0,
        (_d = parseCSSLength(verticalStyle2 || horizontalStyle2 || '0px', bounds.height)) !== null && _d !== void 0 ? _d : 0,
    ];
}
/**
 * Returns the factor by which all border radii have to be scaled to fit correctly.
 *
 * @see https://drafts.csswg.org/css-backgrounds-3/#corner-overlap
 */
export const calculateOverlappingCurvesFactor = (styles, bounds) => Math.min(...SIDES.map(side => {
    const length = isHorizontal(side) ? bounds.width : bounds.height;
    const radiiSum = getBorderRadiiForSide(side, styles, bounds).reduce((sum, radius) => sum + radius, 0);
    return length / radiiSum;
}), 1);
export const isVisible = (styles) => styles.displayOutside !== 'none' &&
    styles.display !== 'none' &&
    styles.visibility !== 'hidden' &&
    styles.opacity !== '0';
export function parseCSSLength(length, containerLength) {
    if (length.endsWith('px')) {
        return parseFloat(length);
    }
    if (length.endsWith('%')) {
        return (parseFloat(length) / 100) * containerLength;
    }
    return undefined;
}
export const unescapeStringValue = (value) => value
    // Replace hex escape sequences
    .replace(/\\([\da-f]{1,2})/gi, (substring, codePoint) => String.fromCodePoint(parseInt(codePoint, 16)))
    // Replace all other escapes (quotes, backslash, etc)
    .replace(/\\(.)/g, '$1');
export function copyCssStyles(from, to) {
    for (const property of from) {
        to.setProperty(property, from.getPropertyValue(property), from.getPropertyPriority(property));
    }
}
//# sourceMappingURL=css.js.map