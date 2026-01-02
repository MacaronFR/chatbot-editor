import React from "react";
import {createContext, type ReactNode, useContext, useState} from "react";
import type TQuestion from "./TQuestion.ts";
import type {SetState} from "./utils.ts";

const CurrentQuestionContext = createContext<[TQuestion | null, SetState<TQuestion | null>]>([null, () => {}]);

interface CurrentQuestionProviderProps {
	children: ReactNode;
}

export function CurrentQuestionProvider(props: CurrentQuestionProviderProps) {
	const [question, setQuestion] = useState<TQuestion | null>(null);
	return <CurrentQuestionContext.Provider value={[question, setQuestion]}>
		{props.children}
	</CurrentQuestionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentQuestion() {
	return  useContext(CurrentQuestionContext);
}