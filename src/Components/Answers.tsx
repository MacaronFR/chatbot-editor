import React from "react";
import Arrow from "./Arrow";
import {useEffect, useMemo, useRef, useState} from "react";
import {CiWarning} from "react-icons/ci";

interface AnswersProps {
	text: string;
	next: string;
	reloadArrows: boolean;
}

export default function Answers(props: AnswersProps) {
	const container = useRef<HTMLDivElement>(null);
	const [pos, setPos] = useState({x: 0, y: 0});
	useEffect(() => {
		setPos(container.current!.getBoundingClientRect());
	}, [props.reloadArrows]);
	const destPos = useMemo(() => {
		return document.getElementById(props.next)?.getBoundingClientRect();
	}, [props.next, props.reloadArrows]);
	return (
		<div className={"rounded bg-stone-700 w-16 px-2 py-1 text-nowrap text-ellipsis relative"} ref={container}>
			<p className={"text-ellipsis text-nowrap overflow-hidden max-w-full"} title={props.text}>{props.text}</p>
			{destPos && <Arrow from={{x: 64, y: 16}} to={{x: destPos.x - pos.x - 1, y: destPos.y - pos.y + 20}}/> || <CiWarning className={"text-orange-500 absolute -right-5 top-2"}/>}
		</div>
	)
}