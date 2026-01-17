import  {type ReactNode} from "react";
import React from "react";

interface ButtonProps {
	children: ReactNode;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	title?: string;
}

export default function Button(props: ButtonProps) {
	return (
		<button title={props.title} className={"bg-stone-800 rounded-lg py-1 px-2 text-lg cursor-pointer transition hover:scale-105 disabled:hover:scale-100 disabled:cursor-default disabled:text-stone-400 disabled:bg-neutral-800"} onClick={props.onClick} disabled={props.disabled}>{props.children}</button>
	)
}