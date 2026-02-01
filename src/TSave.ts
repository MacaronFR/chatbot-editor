import TQuestion from "./TQuestion";
import {Theme} from "./Theme";

export interface TSave {
	questions: TQuestion[];
	theme?: Theme,
	name: string;
}