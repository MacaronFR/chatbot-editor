import {Theme} from "./Theme";
import {TQuestionExport} from "./TQuestion";

export interface TBot {
	name: string;
	theme?: Theme;
	questions: TQuestionExport;
}