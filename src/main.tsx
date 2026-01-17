import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import ChatbotEditor from "./ChatbotEditor";
import type TQuestion from "./TQuestion.ts";
import type { TQuestionExport } from "./TQuestion.ts";
import React from "react";

const save = (save: TQuestion[]) => {
	const file = URL.createObjectURL(new Blob([JSON.stringify(save)], {type: "application/json"}));
	const a = document.createElement("a");
	a.href = file;
	a.download = "questions.json";
	a.click();
	URL.revokeObjectURL(file);
};

const download = (questions: TQuestionExport) => {
	const file = URL.createObjectURL(new Blob([JSON.stringify(questions)], {type: "application/json"}));
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
					resolve(questions);
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
					resolve(questions);
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
