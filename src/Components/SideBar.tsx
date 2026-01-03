import {type ReactNode} from "react";
import type {SetState} from "../utils.ts";
import {clsx} from "clsx";
import {BsCheck, BsX} from "react-icons/bs";
import React from "react";

interface SideBarProps {
	display: boolean;
	setDisplay: SetState<boolean>;
	children: ReactNode;
	onClose?: () => void;
	onValidate?: () => void;
}

export default function SideBar(props: SideBarProps) {
	return (
		<div className={clsx("fixed transition w-1/3 h-full top-0 left-0 bg-stone-900 z-50 flex flex-col", props.display && "translate-x-0" || "-translate-x-full")}>
			<div className={"flex justify-end"}>
				<button className={"mx-2 my-1 p-1 rounded cursor-pointer border border-stone-200/30 aspect-square w-8"} onClick={() => {
					props.setDisplay(false);
					if(props.onClose) {
						props.onClose();
				}}}>
					<BsX className={"w-6 h-6"}/>
				</button>
				{props.onValidate && <button className={"mx-2 my-1 p-1 rounded cursor-pointer border border-stone-200/30 aspect-square w-8"} onClick={() => props.onValidate && props.onValidate()}><BsCheck className={"w-6 h-6"}/></button>}
			</div>
			<div className={"p-2 grow overflow-hidden"}>{props.children}</div>
		</div>
	)
}