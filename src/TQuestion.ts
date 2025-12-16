export default interface TQuestion {
	id: string;
	text: string | string[];
	answers?: TAnswers[];
	goto?: string;
	action?: TAction;
	position: {x: number, y: number};
}

export interface TAnswers {
	text: string;
	next: string;
	action?: TAction
}

export interface TAction {
	action: TActionValue
	property?: string;
	value?: any;
	goto?: string;
}

export type TActionValue = "set" | "ask" | "end";