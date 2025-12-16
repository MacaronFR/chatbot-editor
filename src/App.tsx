import UI from "./UI.tsx";
import Canva from "./Canva.tsx";
import {useState} from "react";
import type TQuestion from "./TQuestion.ts";
import {CurrentQuestionProvider} from "./CurrentQuestionHook.tsx";

export default function App() {
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
				/>
			</div>
		</CurrentQuestionProvider>
	)
}