import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Bubble from "./Bubble.tsx";
import Answers from "./Answers.tsx";
import {useCurrentQuestion} from "../CurrentQuestionHook.tsx";
import * as React from "react";
import Arrow from "./Arrow.tsx";
import type {SetState} from "../utils.ts";
import type {TAction, TAnswers} from "../TQuestion.ts";
import {CiWarning} from "react-icons/ci";

interface QuestionProps {
	id: string;
	text: string | string[];
	goto?: string;
	answers?: TAnswers[];
	action?: TAction;
	reloadArrow: boolean;
	setReloadArrow: SetState<boolean>;
	position: {x: number, y: number};
}

export default function Question(props: QuestionProps) {
	const container = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState(props.position);
	const [clicked, setClicked] = useState(false);
	const [, setOpen] = useState(false);
	const [, setQuestion] = useCurrentQuestion();
	const onMouseDown = useCallback((e: React.MouseEvent) => {
		if(e.button !== 0) return;
		setClicked(true);
		setOpen(true);
	}, []);
	const onMouseUp = useCallback((e: MouseEvent) => {
		if(e.button !== 0) return;
		if(e.target !== container.current && (container.current && !container.current.contains(e.target as Node))) return;
		setClicked(false);
		setOpen(prev => {
			if(prev) {
				setQuestion(props);
			}
			return true;
		})
	}, [props, setQuestion]);
	const onMouseMove = useCallback((e: MouseEvent) => {
		setOpen(false);
		setPosition(prev => {
			return {
				x: prev.x + e.movementX,
				y: prev.y + e.movementY
			}
		});
		props.setReloadArrow(prev => !prev);
	}, [setPosition, props]);
	useEffect(() => {
		if(clicked) {
			document.addEventListener("mousemove", onMouseMove);
		}
		return () => {
			document.removeEventListener("mousemove", onMouseMove)
		}
	}, [clicked, onMouseMove]);
	useEffect(() => {
		document.addEventListener("mouseup", onMouseUp);
		return () => document.removeEventListener("mouseup", onMouseUp);
	}, [onMouseUp]);
	const gotoPosition = useMemo(() => {
		let pos: {x: number, y: number} | undefined = undefined;
		if(props.goto || props.action?.goto) {
			const toElement = document.getElementById(props.goto ?? props.action?.goto ?? "");
			if(toElement) {
				pos = {x: toElement.offsetLeft, y: toElement.offsetTop};
				pos.x -= (position.x - position.x % 20);
				pos.y -= (position.y - position.y % 20);
				pos.y += 18
			} else {
				pos = undefined;
			}
		}
		return pos;
	}, [props.goto, position, props.reloadArrow]);
	return (
		<div id={props.id} className={"w-50 h-64 bg-stone-900 border border-neutral-400/20 rounded z-10 absolute flex flex-col gap-1 pb-1"} style={{top: position.y - (position.y % 20), left: position.x - (position.x % 20)}} onMouseDown={onMouseDown} ref={container}>
			<h2 title={props.id} className={"text-stone-100 m-1 min-h-8 bg-neutral-900 px-2 py-1 font-mono overflow-hidden text-ellipsis"}>{props.id}</h2>
			<div className={"p-1 flex flex-col gap-1 max-h-32 overflow-x-hidden overflow-y-auto"}>
				{ typeof props.text === "string" ? <Bubble text={props.text}/> : props.text.map((v, i) => <Bubble text={v} key={i}/>)}
			</div>
			<div className={"absolute -right-15 top-1 flex flex-col gap-1.5"}>
				{props.answers?.map((v, i) => <Answers text={v.text} key={i} next={v.next} reloadArrows={props.reloadArrow}/>)}
			</div>
			{props.id === "start" && <div className={"absolute top-2 -left-4 w-6 h-6 rounded-full border-2 border-green-800 text-center flex items-center justify-center"}><div className={"bg-green-800 w-4 h-4 rounded-full"}/></div>}
			{(props.goto || props.action?.goto) && <div>
                <div className={"absolute top-2 -right-3 w-6 h-6 rounded-full border-2 border-violet-900 text-center flex justify-center items-center"}><div className={"bg-violet-900 w-4 h-4 rounded-full"}/></div>
				{gotoPosition && <Arrow from={{x: 200, y: 20}} to={gotoPosition}/> || <CiWarning className={"text-orange-500 absolute top-3 -right-7"}/>}
            </div>}
			<div className={"grow"}/>
			{ props.action && <div className={"font-mono text-stone-200 px-4 mx-1 rounded bg-neutral-800 overflow-hidden"}>
				<p className={"font-sans"}>Action</p>
				{props.action.action === "set" && <p><span>{props.action.property}</span> == {props.action.value}</p> }
				{props.action.action === "ask" && <p><span>{props.action.property}</span> == user input</p> }
				{props.action.action === "end" && <p>Chatbot end</p> }
			</div>}
		</div>
	)
}