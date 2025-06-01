import { Bin } from "@rbxts/bin";
import { SkillParser } from "./skill-builder";

/**
 * Represents saved data structure
 */
export interface unkObj {
	[key: string]: unknown;
}

/**
 * Parameters passed to an action function
 */
export type ActionFunctionParams = SkillParser;
/**
 * skill exit symbol (does not error);
 */
export const EXIT_SKILL = 0xff;
/**
 * Type definition for action functions
 */
export type ActionFunction = (params: ActionFunctionParams, meta: unkObj) => void;

// Registry of all available actions
const actions = new Map<string, ActionFunction>();

/**
 * Registers a new action in the system
 * @param name - Unique identifier for the action
 * @param fn - Function to execute when action is invoked
 * @throws Will throw if action name already exists
 */
export function registerAction<T extends ActionFunction>(name: string, fn: T): void {
	if (actions.has(name)) {
		throw `Action "${name}" already exists`;
	}
	actions.set(name, fn);
}

/**
 * Retrieves a registered action
 * @param name - Name of the action to retrieve
 * @returns The action function
 * @throws Will throw if action doesn't exist
 */
export function getAction(name: string): ActionFunction {
	const action = actions.get(name);
	if (!action) {
		throw `Action "${name}" does not exist`;
	}
	return action;
}

/**
 * Checks if an action exists
 * @param name - Name of the action to check
 * @returns True if action exists, false otherwise
 */
export function hasAction(name: string): boolean {
	return actions.has(name);
}
