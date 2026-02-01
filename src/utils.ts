import * as React from "react";
import {Theme} from "./Theme";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function validateTheme(obj: unknown): Theme | undefined {
	if(typeof obj !== "object" || obj === null || obj === undefined) return undefined;
	const res = {} as Theme;
	const keys = Object.keys(obj);
	const entries: Record<string, unknown> = obj as Record<string, unknown>;
	if(keys.includes("primary") && entries["primary"] && typeof entries["primary"] === "string") res.primary = entries["primary"].toString();
	if(keys.includes("primary-dark") && entries["primary-dark"] && typeof entries["primary-dark"] === "string") res.primary = entries["primary-dark"].toString();
	if(keys.includes("onprimary") && entries["onprimary"] && typeof entries["onprimary"] === "string") res.onprimary = entries["onprimary"].toString();
	if(keys.includes("question") && entries["question"] && typeof entries["question"] === "string") res.question = entries["question"].toString();
	if(keys.includes("question-text") && entries["question-text"] && typeof entries["question-text"] === "string") res.question = entries["question-text"].toString();
	if(keys.includes("background") && entries["background"] && typeof entries["background"] === "string") res.background = entries["background"].toString();
	if(keys.includes("option") && entries["option"] && typeof entries["option"] === "string") res.option = entries["option"].toString();
	if(keys.includes("option-hover") && entries["option-hover"] && typeof entries["option-hover"] === "string") res.option = entries["option-hover"].toString();
	if(keys.includes("input") && entries["input"] && typeof entries["input"] === "string") res.input = entries["input"].toString();
	if(keys.includes("input-disabled") && entries["input-disabled"] && typeof entries["input-disabled"] === "string") res.input = entries["input-disabled"].toString();
	if(Object.keys(res).length === 0) return undefined;
	return res;
}
export function hslToRgb(hsl: {h: number, s: number, l: number}) {
	const h = hsl.h / 360;
	const s = hsl.s / 100;
	const l = hsl.l / 100;

	let r, g, b;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		red: Math.round(r * 255),
		green: Math.round(g * 255),
		blue: Math.round(b * 255)
	};
}

export function hsvToHsl(h: number, s: number, v: number) {
	s /= 100;
	v /= 100;

	const l = v * (1 - s / 2);
	const sl = (l === 0 || l === 1) ? 0 : (v - l) / Math.min(l, 1 - l);

	return {
		h,
		s: Math.round(sl * 100),
		l: Math.round(l * 100)
	};
}


export function validRGBHex(str: string) {
	if(str.length != 7 && str.length != 4 && str.length != 9) return false;
	const hex = str.toLowerCase();
	return hex.startsWith("#") && !isNaN(parseInt(hex.slice(1), 16));
}

export function rgbToHsv(r: number, g: number, b: number) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0;
	const v = max;

	// Saturation
	const s = max === 0 ? 0 : delta / max;

	// Hue
	if (delta !== 0) {
		if (max === r) {
			h = ((g - b) / delta) % 6;
		} else if (max === g) {
			h = (b - r) / delta + 2;
		} else {
			h = (r - g) / delta + 4;
		}

		h *= 60;
		if (h < 0) h += 360;
	}

	return {
		h: Math.round(h),
		s: Math.round(s * 100),
		v: Math.round(v * 100),
	};
}