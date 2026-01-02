import SideBar from "./Components/SideBar";
import {useEffect, useState} from "react";
import {useCurrentQuestion} from "./CurrentQuestionHook";
import type TQuestion from "./TQuestion.ts";
import type { TAnswers, TAction } from "./TQuestion.ts";
import type {SetState} from "./utils.ts";
import Button from "./Components/Button";
import Input from "./Components/Input";
import {clsx} from "clsx";
import Select from "./Components/Select";
import {BsPlus} from "react-icons/bs";
import {LuSave} from "react-icons/lu";
import {MdOutlineFileOpen} from "react-icons/md";
import {BiDownload, BiUpload} from "react-icons/bi";
import React from "react";

interface UIProps {
	questions: TQuestion[];
	setQuestions: SetState<TQuestion[]>;
	addQuestion: (initPos: {x: number, y: number}) => void;
	editQuestion: (id: string, data: TQuestion) => void;
	deleteQuestion: (id: string) => void;
	setReloadArrow: SetState<boolean>;
	save?: (questions: TQuestion[]) => void;
	load?: () => Promise<TQuestion[]>;
	export?: (questions: TQuestion[]) => void;
	import?: () => Promise<TQuestion[]>;
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
				{props.save && <Button onClick={() => props.save && props.save(props.questions)}><LuSave className={"w-6 h-6"}/></Button>}
				{props.load && <Button onClick={async () => {
					if(props.load) {
						const questions = await props.load();
						props.setQuestions(questions);
						props.setReloadArrow(prev => !prev);
					}
				}}><MdOutlineFileOpen className={"w-6 h-6"}/></Button>}
				{props.export && <Button onClick={() => props.export && props.export(props.questions)}><BiDownload className={"w-6 h-6"}/></Button>}
				{ props.import &&<Button onClick={async () => {
					if(props.import) {
						const questions = await props.import();
						props.setQuestions(questions);
						props.setReloadArrow(prev => !prev);
					}
				}}><BiUpload className={"w-6 h-6"}/></Button>}
			</div>
		</div>
	)
}