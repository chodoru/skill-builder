import { Bin } from "@rbxts/bin";
import { SkillBuilder } from ".";

/**
 * Represents the execution environment for an action
 */
export interface ActionExecutionContext {
    character: Instance;
    bin: Bin;
}

/**
 * Represents saved data structure
 */
export interface SaveData {
    [key: string]: unknown;
}

/**
 * Parameters passed to an action function
 */
export interface ActionFunctionParams {
    env: ActionExecutionContext;
    previous?: SaveData;
    loaded: Map<string, SaveData>;
}

/**
 * Return type for action functions
 */
export interface ActionFunctionResult {
    [key: string]: unknown;
}

/**
 * Type definition for action functions
 */
export type ActionFunction = (params: ActionFunctionParams) => ActionFunctionResult;

// Registry of all available actions
const actions = new Map<string, ActionFunction>();

/**
 * Registers a new action in the system
 * @param name - Unique identifier for the action
 * @param fn - Function to execute when action is invoked
 * @throws Will throw if action name already exists
 */
export function registerAction(name: string, fn: ActionFunction): void {
    if (actions.has(name)) {
        throw new Error(`Action "${name}" already exists`);
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
        throw new Error(`Action "${name}" does not exist`);
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
