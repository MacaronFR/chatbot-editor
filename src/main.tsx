import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import ChatbotEditor from "./ChatbotEditor";
import type TQuestion from "./TQuestion.ts";
import type { TAction, TAnswers } from "./TQuestion.ts";
import React from "react";

const save = (questions: TQuestion[]) => {
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
};

const download = (questions: TQuestion[]) => {
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
};

const load = async () => {
	const fileLoader = document.createElement("input");
	fileLoader.type = "file";
	fileLoader.accept = ".json";
	const p = new Promise<TQuestion[]>((resolve, reject) => {
		fileLoader.addEventListener("change", () => {
			if(fileLoader.files?.length === 1) {
				fileLoader.files[0].text().then(v => {
					const questions = JSON.parse(v);
					if(typeof questions === "object" && questions instanceof Array) {
						const validate = questions.filter(q => {
							return typeof q["id"] === "string" && typeof q["text"] === "string" && typeof q["position"] === "object" && typeof q["position"]["x"] === "number" && typeof q["position"]["y"] === "number"
						});
						if(validate.length !== questions.length) {
							console.error("Invalid file format");
							return;
						}
						resolve(questions as TQuestion[]);
					} else {
						reject("Invalid file format");
					}
				}).catch(reject);
			} else {
				reject("You must select only one file");
			}
		});
	});
	fileLoader.click();
	return p;
}

const importFile = async () => {
	const fileLoader = document.createElement("input");
	fileLoader.type = "file";
	fileLoader.accept = ".json";
	const p = new Promise<TQuestion[]>((resolve, reject) => {
		fileLoader.addEventListener("change", () => {
			if (fileLoader.files?.length === 1) {
				fileLoader.files[0].text().then(v => {
					const questions = JSON.parse(v);
					if (typeof questions === "object") {
						const validate = Object.values<any>(questions).filter(q => {
							return typeof q["question"] === "string" || (typeof q["question"] === "object" && q["question"] instanceof Array)
						});
						if (validate.length !== Object.values(questions).length) {
							reject("Invalid file format");
							return;
						}
						const tmp = Object.keys(questions).map((id, index) => {
							return {
								id: id,
								text: questions[id]["question"],
								goto: questions[id]["goto"] ?? undefined,
								answers: questions[id]["answers"] ?? [],
								position: {x: index % 5 * 260 + 20, y: Math.floor(index / 5) * 300 + 20},
								action: questions[id]["action"] ?? undefined
							} as TQuestion;
						});
						resolve(tmp);
					} else {
						reject("Invalid file format");
					}
				}).catch(reject);
			}
		});
	});
	fileLoader.click();
	return p;
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ChatbotEditor save={save} load={load} export={download} import={importFile}/>
	</StrictMode>,
)
