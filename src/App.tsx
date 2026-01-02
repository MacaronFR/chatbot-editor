import UI from "./UI";
import Canva from "./Canva";
import {useState} from "react";
import type TQuestion from "./TQuestion.ts";
import {CurrentQuestionProvider} from "./CurrentQuestionHook";
import React from "react";

interface AppProps {
	save?: (questions: TQuestion[]) => void;
	load?: () => Promise<TQuestion[]>;
	export?: (questions: TQuestion[]) => void;
	import?: () => Promise<TQuestion[]>;
}

export default function App(props: AppProps) {
	const [questions, setQuestions] = useState<TQuestion[]>([]);
	const [reloadArrow, setReloadArrow] = useState(false);
	return (
		<CurrentQuestionProvider>
			<div className={"relative h-screen w-screen overflow-hidden"}>
				<Canva questions={questions} setQuestions={setQuestions} reloadArrow={reloadArrow} setReloadArrow={setReloadArrow}/>
				<UI setReloadArrow={setReloadArrow} questions={questions} addQuestion={(initPos: {x: number, y: number}) => {
					let idQuestion = "question";
					let i = 0;
					while(questions.find(v => v.id === idQuestion)) {
						i++;
						idQuestion = `question${i}`;
					}
					setQuestions(prev => [...prev, {id: idQuestion, text: "Text", position: initPos}]);
				}} editQuestion={(id, data) =>
					setQuestions(prev => prev.map(v => v.id === id ? data : v))
				}
					deleteQuestion={id => setQuestions(prev => prev.filter(v => v.id !== id))}
					setQuestions={setQuestions}
					save={props.save}
					load={props.load}
					export={props.export}
					import={props.import}
				/>
			</div>
		</CurrentQuestionProvider>
	)
}