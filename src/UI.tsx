import SideBar from "./Components/SideBar.tsx";
import {useCallback, useEffect, useState} from "react";
import {useCurrentQuestion} from "./CurrentQuestionHook.tsx";
import type TQuestion from "./TQuestion.ts";
import type { TAnswers, TAction } from "./TQuestion.ts";
import type {SetState} from "./utils.ts";
import Button from "./Components/Button.tsx";
import Input from "./Components/Input.tsx";
import {clsx} from "clsx";
import Select from "./Components/Select.tsx";
import {BsPlus} from "react-icons/bs";
import {LuSave} from "react-icons/lu";
import {MdOutlineFileOpen} from "react-icons/md";
import {BiDownload, BiUpload} from "react-icons/bi";

interface UIProps {
	questions: TQuestion[];
	setQuestions: SetState<TQuestion[]>;
	addQuestion: (initPos: {x: number, y: number}) => void;
	editQuestion: (id: string, data: TQuestion) => void;
	deleteQuestion: (id: string) => void;
	setReloadArrow: SetState<boolean>;
}

export default function UI(props: UIProps) {
	const [question, setQuestion] = useCurrentQuestion();
	const [id, setId] = useState("");
	const [goto, setGoto] = useState<string>();
	const [text, setText] = useState<string[]>([""]);
	const [answers, setAnswers] = useState<TAnswers[]>([]);
	const [action, setAction] = useState<TAction | undefined>(undefined);
	useEffect(() => {
		if(question) {
			setId(question.id);
			if(typeof question.text === "string") {
				setText([question.text]);
			} else {
				setText(question.text);
			}
			setGoto(question.goto);
			setAnswers(question.answers ?? []);
			setAction(question.action);
		}
	}, [question]);
	const save = useCallback((questions: TQuestion[]) => {
		const save = questions.map(q => {
			const pos = document.getElementById(q.id)!.getBoundingClientRect();
			q.position.x = pos.x;
			q.position.y = pos.y;
			return q;
		});
		const file = URL.createObjectURL(new Blob([JSON.stringify(save)], {type: "application/json"}));
		const a = document.createElement("a");
		a.href = file;
		a.download = "questions.json";
		a.click();
		URL.revokeObjectURL(file);
	}, []);
	const download = useCallback((questions: TQuestion[]) => {
		const result = {} as Record<string, {question: string | string[], goto?: string, answers: TAnswers[] | undefined, action?: TAction}>;
		questions.forEach(q => result[q.id] = {
			question: q.text,
			goto: q.goto,
			action: q.action,
			answers: q.answers
		});
		const file = URL.createObjectURL(new Blob([JSON.stringify(result)], {type: "application/json"}));
		const a = document.createElement("a");
		a.href = file;
		a.download = "questions.json";
		a.click();
		URL.revokeObjectURL(file);
	}, []);
	return (
		<div className={"fixed top-0 left-0 w-0 h-0 overflow-visible text-white z-10"}>
			<SideBar display={question !== null} setDisplay={(value) => { if(typeof value === "function") value = value(question !== null); if(!value) setQuestion(null) }} onClose={() => setQuestion(null)} onValidate={() => {
				const t = text.length === 1 ? text[0] : text;
				props.editQuestion(question?.id ?? "", {id: id, text: t, goto: goto, answers: answers, position: {x: 0, y: 0}, action: action});
				setQuestion(null);
			}}>
				<div className={"flex flex-col gap-2 h-full pb-8 overflow-y-auto overflow-x-hidden"}>
					<Input type={"text"} value={id} onChange={(e) => setId(e.target.value)} label={"ID"}/>
					<div className={"bg-stone-950 p-2 rounded-lg flex flex-col gap-1"}>
						<p className={"text-lg font-bold "}>Text</p>
						{text.map((value, index) => <div className={"flex gap-1"} key={index}>
							<Input type={"text"} value={value} onChange={(e) => setText(prev => prev.map((v, i) => i === index ? e.target.value : v))}/>
							<Button onClick={() => setText(prev => prev.filter((_, i) => i !== index))}>-</Button>
						</div>)}
						<Button onClick={() => setText(prev => [...prev, ""])}>+</Button>
					</div>
					<div className={"bg-stone-950 p-2 rounded-lg flex flex-col gap-1"}>
						<p className={"text-lg font-bold"}>Answers</p>
						{answers.map((value, index) => <div className={"flex ga flex-col p-1"} key={index}>
							<div className={"flex gap-1 items-end"}>
								<Input type={"text"} value={value.text} onChange={(e) => setAnswers(prev => prev.map((v, i) => i === index ? {...v, text: e.target.value} : v))} label={"Text"}/>
								<Input type={"text"} value={value.next} onChange={(e) => setAnswers(prev => prev.map((v, i) => i === index ? {...v, next: e.target.value} : v))} label={"Next"}/>
								<Button onClick={() => setAnswers(prev => prev.filter((_, i) => i !== index))}>-</Button>
							</div>
							<div className={"flex flex-col gap-1"}>
								<p>Action</p>
								<Select options={[{value: "none", label: "None"}, {value: "set", label: "Set"}]} value={value.action?.action ?? "none"} onChange={ (v) => v === "none" ?
									setAnswers(prev => prev.map((v, i) => i === index ? {...v, action: undefined} : v)) :
									setAnswers(prev => prev.map((v, i) => i === index ? {...v, action: {action: "set"}} : v))
								}/>
								<Input className={clsx(value.action === undefined && "hidden")} label={"Property"} value={value.action?.property ?? ""} onChange={e => setAnswers(prev => prev.map((v, i) => i === index ? {...v, action: {action: value.action!.action, property: e.target.value, value: value.action?.value}} : v))}/>
								<Input className={clsx(value.action === undefined && "hidden")} label={"Value"} value={value.action?.value ?? ""} onChange={e => setAnswers(prev => prev.map((v, i) => i === index ? {...v, action: {action: value.action!.action, value: e.target.value, property: value.action?.property}} : v))}/>
							</div>
						</div>)}
						<Button disabled={goto !== undefined} onClick={() => setAnswers(prev => [...prev, {text: "", next: ""}])}>+</Button>
					</div>
					<div className={"bg-stone-950 p-2 rounded-lg flex flex-col gap-1"}>
						<p className={"text-lg font-bold"}>Action</p>
						<Select options={[{value: "ask", label: "Ask"}, {value: "set", label: "Set"}, {value: "end", label: "End"}, {value: "none", label: "None"}]} value={action?.action ?? "none"} onChange={(v) => {
							switch (v) {
								case "ask":
									setAction(prev => ({action: "ask", property: prev?.property, value: undefined}));
									break;
								case "end":
									setAction({action: "end", property: undefined, value: undefined});
									break;
								case "set":
									setAction(prev => ({action: "set", property: prev?.property, value: prev?.value}));
									break;
								case "none":
									setAction(undefined);
									break;
							}
						}}/>
						<Input className={clsx((action === undefined || action.action === "end") && "hidden")} type={"text"} label={"Property"} value={action?.property ?? ""} onChange={(e) => setAction(prev => prev ? ({...prev, property: e.target.value === "" ? undefined : e.target.value}) : undefined)}/>
						<Input className={clsx((action === undefined || action.action !== "set") && "hidden")} type={"text"} label={"Value"} value={action?.value ?? ""} onChange={(e) => setAction(prev => prev ? ({...prev, value: e.target.value === "" ? undefined : e.target.value}) : undefined)}/>
						<Input className={clsx((action === undefined || action.action !== "ask") && "hidden")} type={"text"} label={"Goto"} value={action?.goto ?? ""} onChange={(e) => setAction(prev => prev ? ({...prev, goto: e.target.value === "" ? undefined : e.target.value}) : undefined)}/>
					</div>
					<Input disabled={answers.length !== 0} type={"text"} label={"Goto"} value={goto ?? ""} onChange={(e) => setGoto(e.target.value === "" ? undefined : e.target.value)}/>
					<div className={"grow"}/>
					<Button onClick={() => {
						props.deleteQuestion(question?.id ?? "")
						setQuestion(null);
					}}>Delete</Button>
				</div>
			</SideBar>
			<div className={"p-2 fixed right-8 top-0 flex gap-2"}>
				<Button onClick={() => props.addQuestion({x: 20, y: 20})}><BsPlus className={"w-6 h-6"}/></Button>
				<Button onClick={() => save(props.questions)}><LuSave className={"w-6 h-6"}/></Button>
				<label className={"bg-stone-800 rounded-lg px-2 py-1 cursor-pointer flex items-center"} htmlFor={"load"}>
					<span><MdOutlineFileOpen className={"w-6 h-6"}/></span>
					<input type={"file"} className={"hidden"} multiple={false} accept={".json"} id={"load"} onChange={(e) => {
						if(e.target.files?.length === 1) {
							e.target.files[0].text().then(v => {
								const questions = JSON.parse(v);
								if(typeof questions === "object" && questions instanceof Array) {
									const validate = questions.filter(q => {
										return typeof q["id"] === "string" && typeof q["text"] === "string" && typeof q["position"] === "object" && typeof q["position"]["x"] === "number" && typeof q["position"]["y"] === "number"
									});
									if(validate.length !== questions.length) {
										console.error("Invalid file format");
										return;
									}
									props.setQuestions(questions);
									props.setReloadArrow(prev => !prev);
								} else {
									console.error("Invalid file format");
								}
							})
						}
					}}/>
				</label>
				<Button onClick={() => download(props.questions)}><BiDownload className={"w-6 h-6"}/></Button>
				<label className={"bg-stone-800 rounded-lg px-2 py-1 cursor-pointer flex items-center"} htmlFor={"import"}>
					<span><BiUpload className={"w-6 h-6"}/></span>
					<input type={"file"} className={"hidden"} multiple={false} accept={".json"} id={"import"} onChange={(e) => {
						if(e.target.files?.length === 1) {
							e.target.files[0].text().then(v => {
								const questions = JSON.parse(v);
								if(typeof questions === "object") {
									const validate = Object.values<any>(questions).filter( q => {
										return typeof q["question"] === "string" || (typeof q["question"] === "object" && q["question"] instanceof Array)
									});
									if(validate.length !== Object.values(questions).length) {
										console.error("Invalid file format");
										return;
									}
									const tmp = Object.keys(questions).map((id, index) => {
										return { id: id, text: questions[id]["question"], goto: questions[id]["goto"] ?? undefined, answers: questions[id]["answers"] ?? [], position: {x: index % 5 * 260 + 20, y: Math.floor(index / 5) * 300 + 20}, action: questions[id]["action"] ?? undefined} as TQuestion;
									});
									props.setQuestions(tmp);
									props.setReloadArrow(prev => !prev);
								} else {
									console.error("Invalid file format");
								}
							})
						}
					}}/>
				</label>
			</div>
		</div>
	)
}