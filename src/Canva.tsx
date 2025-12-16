import Question from "./Components/Question.tsx";
import type TQuestion from "./TQuestion.ts";
import type {SetState} from "./utils.ts";
import {useEffect} from "react";

interface CanvaProps {
	questions: TQuestion[];
	setQuestions: SetState<TQuestion[]>;
	reloadArrow: boolean;
	setReloadArrow: SetState<boolean>;
}

export default function Canva(props: CanvaProps) {
	useEffect(() => {
		props.setReloadArrow(prev => !prev);
	}, [props.questions, props.setReloadArrow]);
	return (
		<div className={"min-w-full min-h-full bg-neutral-950 workspace overflow-auto"}>
			{props.questions.map((v, i) => <Question {...v} key={i} reloadArrow={props.reloadArrow} setReloadArrow={props.setReloadArrow}/>)}
		</div>
	)
}