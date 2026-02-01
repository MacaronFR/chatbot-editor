import UI from "./UI";
import Canva from "./Canva";
import React, {useEffect, useMemo, useState} from "react";
import type TQuestion from "./TQuestion.ts";
import type { TAction, TAnswers, TQuestionExport } from "./TQuestion.ts";
import {CurrentQuestionProvider} from "./CurrentQuestionHook";
import {Theme} from "./Theme";
import {TSave} from "./TSave";
import {validateTheme} from "./utils";
import {TBot} from "./TBot";

interface AppProps {
	save?: (questions: TSave) => void;
	load?: () => Promise<unknown>;
	export?: (questions: TBot) => void;
	import?: () => Promise<unknown>;
	init?: () => Promise<TSave>;
	autosaveInterval?: number;
}

export default function ChatbotEditor(props: AppProps) {
	const [name, setName] = useState("");
	const [theme, setTheme] = useState<Theme>();
	const [questions, setQuestions] = useState<TQuestion[]>([]);
	const [reloadArrow, setReloadArrow] = useState(false);
	const [baseTheme, setBaseTheme] = useState<Theme>();
	const save = useMemo(() => {
		if(props.save) {
			return () => {
				const savedQuestions = questions.map(q => {
					const pos = document.getElementById(q.id)!.getBoundingClientRect();
					q.position.x = pos.x;
					q.position.y = pos.y;
					return q;
				});
				if(props.save) props.save({name: name, questions: savedQuestions, theme: theme});
			}
		} else {
			return undefined;
		}
	}, [name, props, questions, theme]);
	const exportData = useMemo(() => {
		if(props.export) {
			return () => {
				const result = {} as Record<string, {question: string | string[], goto?: string, answers: TAnswers[] | undefined, action?: TAction}>;
				questions.forEach(q => result[q.id] = {
					question: q.text,
					goto: q.goto,
					action: q.action,
					answers: q.answers
				});
				if(props.export) props.export({ questions: result, name: name, theme: theme});
			};
		} else {
			return undefined;
		}
	}, [props, questions, name, theme]);
	const load = useMemo(() => {
		if(props.load) {
			return async () => {
				if(!props.load) return [];
				const save = await props.load();
				if(typeof save === "object" && (save as TSave).questions !== undefined && (save as TSave).name !== undefined && typeof (save as TSave).name === "string") {
					setName((save as TSave).name);
					setTheme(validateTheme((save as TSave).theme));
					setBaseTheme(validateTheme((save as TSave).theme));
					const questions = (save as TSave)["questions"] as unknown;
					if(typeof questions === "object" && questions instanceof Array) {
						const validate = questions.filter(q => {
							return typeof q["id"] === "string" && typeof q["text"] === "string" && typeof q["position"] === "object" && typeof q["position"]["x"] === "number" && typeof q["position"]["y"] === "number"
						});
						if(validate.length !== questions.length) {
							throw "Invalid file format";
						}
						return questions as TQuestion[];
					} else {
						throw "Invalid file format";
					}
				} else {
					console.log("ICI")
					throw "Invalid file format";
				}
			}
		} else {
			return undefined;
		}
	}, [props]);
	const importData = useMemo(() => {
		if(props.import) {
			return async () => {
				if(!props.import) return [];
				const bot = await props.import();
				if(typeof bot === "object" && (bot as TBot).questions !== undefined && (bot as TBot).name !== undefined && typeof (bot as TBot).name === "string") {
					setName((bot as TBot).name);
					setTheme(validateTheme((bot as TBot).theme));
					setBaseTheme(validateTheme((bot as TBot).theme));
					const questions = (bot as TBot).questions as unknown;
					if (typeof questions === "object" && questions !== null) {
						const validate = Object.values<any>(questions).filter(q => {
							return typeof q["question"] === "string" || (typeof q["question"] === "object" && q["question"] instanceof Array)
						});
						if (validate.length !== Object.values(questions).length) {
							throw "Invalid file format";
						}
						return Object.keys(questions).map((id, index) => {
							const q = (questions as Record<string, unknown>)[id] as { question: string | string[], goto?: string, answers?: TAnswers[], action?: TAction };
							return {
								id: id,
								text: q.question,
								goto: q.goto ?? undefined,
								answers: q.answers ?? [],
								position: {x: index % 5 * 260 + 20, y: Math.floor(index / 5) * 300 + 20},
								action: q.action ?? undefined
							} as TQuestion;
						});
					} else {
						throw "Invalid file format";
					}
				} else {
					throw "Invalid file format";
				}
			}
		} else {
			return undefined;
		}
	}, [props])
	useEffect(() => {
		if(props.init) {
			props.init().then((res) => {
				setQuestions(res.questions);
				setName(res.name);
				setTheme(res.theme);
				setReloadArrow(prev => !prev);
				setBaseTheme(res.theme);
			});
		}
	}, [props, props.init]);
	useEffect(() => {
		if(props.autosaveInterval && save) {
			const interval = setInterval(() => {
				save();
			}, props.autosaveInterval);
			return () => clearInterval(interval);
		}
	}, [props.autosaveInterval, save]);
	return (
		<CurrentQuestionProvider>
			<div className={"relative h-full w-full overflow-hidden"}>
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
					save={save}
					load={load}
					export={exportData}
					import={importData}
					name={name} setName={setName}
					theme={theme} setTheme={setTheme}
					baseTheme={baseTheme}
				/>
			</div>
		</CurrentQuestionProvider>
	)
}