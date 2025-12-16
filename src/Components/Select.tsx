import * as React from "react";
import {useMemo, useRef, useState} from "react";
import {clsx} from "clsx";
import {BsChevronDown} from "react-icons/bs";

export interface Option {
	value: string;
	label: React.ReactNode;
}

interface SelectProps {
	options: Option[];
	id?: string;
	value: string;
	onChange: (v: string) => void;
}

export default function Select(props: SelectProps) {
	const select = useRef<HTMLSelectElement | null>(null);
	const id = useMemo(() => {
		return props.id ?? (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
	}, [props.id]);
	const [visible, setVisible] = useState(false);
	return (
		<label htmlFor={id}>
			<div className={"relative bg-stone-800 rounded-lg h-8 flex justify-between items-center px-2"} onClick={() => setVisible(prev => !prev)}>
				<p>{props.options.find(o => o.value == props.value)?.label ?? props.value}</p>
				<button><BsChevronDown/></button>
				<div className={clsx("absolute bg-stone-800 pt-2 -mt-2 z-0 w-full rounded-b-lg top-full left-0", visible || "hidden")}>
					{props.options.map((v, i) =>
						<p key={i} className={"p-1 hover:bg-stone-900"} onClick={() => {
							if(select.current) {
								select.current.value = v.value;
								props.onChange(v.value);
							}
						}}>{v.label}</p>
					)}
				</div>
			</div>
			<select className={"hidden"} id={id} onChange={e => props.onChange(e.target.value)} value={props.value} ref={select}>
				{props.options.map((v, i) => <option value={v.value} key={i}>{v.label}</option>)}
			</select>
		</label>
	)
}