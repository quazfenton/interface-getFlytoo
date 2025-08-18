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
const Button = React.forwardRef((_a, ref) => {
    var { className, variant, size, asChild = false } = _a, props = __rest(_a, ["className", "variant", "size", "asChild"]);
    return (_jsx("button", Object.assign({ className: `px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
          ${variant === 'destructive' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
          ${variant === 'outline' ? 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100' : ''}
          ${variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
          ${variant === 'ghost' ? 'bg-transparent text-gray-700 hover:bg-gray-100' : ''}
          ${variant === 'link' ? 'bg-transparent text-blue-600 hover:underline' : ''}
          ${variant === 'default' || !variant ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
          ${size === 'sm' ? 'px-3 py-1.5 text-xs' : ''}
          ${size === 'lg' ? 'px-5 py-2.5 text-base' : ''}
          ${size === 'icon' ? 'p-2' : ''}
          ${className || ''}
        `, ref: ref }, props)));
});
Button.displayName = 'Button';
export { Button };
