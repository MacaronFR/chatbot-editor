import * as React from "react";
import {useMemo} from "react";
import {clsx} from "clsx";

interface InputProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: React.HTMLInputTypeAttribute;
	label?: React.ReactNode;
	disabled?: boolean;
	id?: string;
	className?: string;
}

export default function Input(props: InputProps) {
	const id = useMemo(() => {
		return props.id ?? (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
	}, [props.id]);
	return (
		<div className={clsx("flex flex-col", props.className)}>
			{props.label && <label className={clsx("px-2 pt-1 rounded-t-lg pb-2 -mb-2", props.disabled === true && "text-stone-500 bg-neutral-950" || "bg-stone-950")} htmlFor={id}>{props.label}</label>}
			<input type={props.type} value={props.value} onChange={props.onChange} id={id} className={"bg-stone-800 rounded-lg py-1 px-2 text-lg disabled:bg-neutral-900"} disabled={props.disabled}/>
		</div>
	)
}