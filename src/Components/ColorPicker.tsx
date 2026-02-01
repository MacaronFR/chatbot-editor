import React, {useCallback, useEffect, useMemo, useState} from "react";
import {hslToRgb, hsvToHsl, rgbToHsv, validRGBHex} from "../utils";

interface ColorPickerProps {
	defaultValue?: string;
	onChange?: (color: string) => void;
	label?: string;
}

export default function ColorPicker(props: ColorPickerProps) {
	const {onChange} = props;
	const [hue, setHue] = useState(0);
	const [saturation, setSaturation] = useState(100);
	const [value, setValue] = useState(100);
	const rgb = useMemo(() => hslToRgb(hsvToHsl(hue, saturation, value)), [hue, value, saturation]);
	const rgbHue = useMemo(() => hslToRgb({h: hue, s: 100, l: 50}), [hue]);
	const [hueSize, setHueSize] = useState([0, 0]);
	const [hueClick, setHueClick] = useState(false);
	const [svClick, setSvClick] = useState(false);
	const [svSize, setSvSize] = useState([0, 0, 0, 0]);
	const [inputFocus, setInputFocus] = useState(false);
	const [rgbHex, setRgbHex] = useState("#ff0000");
	const calcRgb = useCallback(() => {
		if(inputFocus) return;
		const rgbHex = `#${rgb.red.toString(16).padStart(2, "0")}${rgb.green.toString(16).padStart(2, "0")}${rgb.blue.toString(16).padStart(2, "0")}`
		setRgbHex(rgbHex);
		if (onChange) onChange(rgbHex);
	}, [inputFocus, rgb, onChange]);
	const onMouseUp = useCallback(() => {
		setHueClick(false);
		setSvClick(false);
	}, []);
	const onMouseMove = useCallback((e: MouseEvent) => {
		const [width, left] = hueSize;
		if(hueClick) {
			setHue(Math.min(360, Math.max(0, Math.round((e.clientX - left) / width * 360))));
			calcRgb();
		}
		if(svClick) {
			const [width, height, left, top] = svSize;
			setSaturation(Math.min(100, Math.max(0, Math.round(100 * (e.clientX - left) / width))));
			setValue(Math.min(100, Math.max(0, 100 - Math.round(100 * (e.clientY - top) / height))));
			calcRgb();
		}
	}, [hueSize, hueClick, svClick, svSize, calcRgb]);
	useEffect(() => {
		document.addEventListener("mouseup", onMouseUp);
		document.addEventListener("mousemove", onMouseMove);
		return () => {
			document.removeEventListener("mouseup", onMouseUp);
			document.removeEventListener("mousemove", onMouseMove);
		}
	}, [onMouseUp, onMouseMove]);
	useEffect(() => {
		if(props.defaultValue && validRGBHex(props.defaultValue)) {
			const hex = props.defaultValue
			const step = hex.length === 4 ? 1 : 2;
			let r = parseInt(hex.slice(1, 1 + step), 16);
			let g = parseInt(hex.slice(1 + step, 1 + 2*step), 16);
			let b = parseInt(hex.slice(1 + 2 * step, 1 + 3 * step), 16);
			if(step === 1) {
				r *= 16;
				g *= 16;
				b *= 16;
			}
			const hsv = rgbToHsv(r, g, b);
			setHue(hsv.h);
			setSaturation(hsv.s);
			setValue(hsv.v);
			setRgbHex(hex);
		}
	}, [props.defaultValue]);
	return (
		<div className={"bg-stone-950 rounded p-2"}>
			{props.label && <div className={"font-bold mb-1"}>{props.label}</div>}
			<div className={"flex gap-2"}>
				<div className={"flex flex-col gap-2"}>
					<div
						className={"w-64 h-48 rounded cursor-crosshair"}
						style={{background: `linear-gradient(transparent 0%, #000 100%), linear-gradient(to left, transparent 0%, #FFF 100%), linear-gradient(to left, transparent 0%, rgb(${rgbHue.red}, ${rgbHue.green}, ${rgbHue.blue}) 100%), rgb(${rgbHue.red}, ${rgbHue.green}, ${rgbHue.blue})`}}
						onMouseDown={(e) => {
							setSvClick(true);
							const rect = e.currentTarget.getBoundingClientRect();
							setSvSize([rect.width, rect.height, rect.left, rect.top]);
							setSaturation(Math.min(100, Math.max(0, Math.round(100 * (e.clientX - rect.left) / rect.width))));
							setValue(Math.min(100, Math.max(0, 100 - Math.round(100 * (e.clientY - rect.top) / rect.height))));
							calcRgb();
						}}
						onMouseUp={() => setSvClick(false)}
					>
						<div className={"border-2 border-neutral-300 relative h-4 w-4 rounded-full -translate-2 pointer-events-none"} style={{background: `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`, top: (100 - value) + "%", left: saturation + "%" }}/>
					</div>
					<div className={"w-64 h-4 relative rounded"} style={{background: "linear-gradient(90deg,red,#ff0 17%,#0f0 33%,#0ff 50%,#00f 66%,#f0f 83%,red)"}}
						 onMouseDown={(e) =>{
							 setHueClick(true);
							 const rect = e.currentTarget.getBoundingClientRect();
							 setHueSize([rect.width, rect.left]);
							 setHue(Math.min(360, Math.max(0, Math.round((e.clientX - rect.left) / rect.width * 360))));
							 calcRgb();
						 }}
						 onMouseUp={() => setHueClick(false)}
					>
						<span className={"border-2 border-neutral-500 rounded-full w-2 h-6 block -translate-y-1 -translate-x-1 relative pointer-events-none"} style={{left: (hue / 360) * 100 + "%", background: `rgb(${rgbHue.red}, ${rgbHue.green}, ${rgbHue.blue})`}}></span>
					</div>
				</div>
				<div className={"flex flex-col gap-2"}>
					<div className={"h-12 rounded"} style={{background: `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`}}/>
					<div>
						<span>hex: </span>
						<input className={"bg-stone-800 rounded px-1 py-0.5 w-20"} type={"text"} value={rgbHex} onFocus={() => setInputFocus(true)} onBlur={() => setInputFocus(false)} onChange={(e) => {
							if(validRGBHex(e.currentTarget.value)) {
								const hex = e.currentTarget.value
								const step = hex.length === 4 ? 1 : 2;
								let r = parseInt(hex.slice(1, 1 + step), 16);
								let g = parseInt(hex.slice(1 + step, 1 + 2*step), 16);
								let b = parseInt(hex.slice(1 + 2 * step, 1 + 3 * step), 16);
								if(step === 1) {
									r *= 16;
									g *= 16;
									b *= 16;
								}
								const hsv = rgbToHsv(r, g, b);
								setHue(hsv.h);
								setSaturation(hsv.s);
								setValue(hsv.v);
								if(onChange) onChange(hex);
							}
							setRgbHex(e.currentTarget.value);
						}}/>
					</div>
				</div>
			</div>
		</div>
	)
}
