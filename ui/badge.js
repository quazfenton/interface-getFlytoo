var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
const Badge = React.forwardRef((_a, ref) => {
    var { className, variant } = _a, props = __rest(_a, ["className", "variant"]);
    return (_jsx("div", Object.assign({ ref: ref, className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          ${variant === 'default' ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' : ''}
          ${variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
          ${variant === 'destructive' ? 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80' : ''}
          ${variant === 'outline' ? 'text-foreground' : ''}
          ${className || ''}
        ` }, props)));
});
Badge.displayName = 'Badge';
export { Badge };
