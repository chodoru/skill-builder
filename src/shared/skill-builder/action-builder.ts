import { Bin } from "@rbxts/bin";
import { SkillBuilder } from "./main";
export interface FnParamsObj {
	env: {
		character: Instance;
		bin: Bin;
	};
	previous?: SaveData;
	loaded: Map<string, SaveData>;
}
export interface SaveData {
	[key: string]: unknown;
}
export type actionFn = (obj: FnParamsObj) => { [key: string]: unknown };
const actions = new Map<string, actionFn>();
export function addAction(action: string, fn: actionFn) {
	if (actions.has(action)) throw "ACTION " + action + " ALREADY EXISTS!";
	actions.set(action, fn);
}
export function getAction(action: string) {
	if (!actions.has(action)) throw "ACTION " + action + " DOES NOT EXIST!";
	return actions.get(action) as actionFn;
}
