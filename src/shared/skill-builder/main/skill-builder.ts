import { Bin } from "@rbxts/bin";
import { ActionFunction, ActionFunctionParams, EXIT_SKILL, getAction } from "./action-builder";
import { parsePath } from "./path-parse";
parsePath("../../actions")
	.GetChildren()
	.filter((v) => v.IsA("ModuleScript"))
	.forEach((v) => require(v));
type unkObj = { [key: string]: unknown };
type NextParams = unkObj | typeof EXIT_SKILL;
type voidFn = (params: ActionFunctionParams) => void;
interface InstructionObject {
	actionTuple?: [ActionFunction, unkObj];
	afterFn?: voidFn;
	saveResultAs?: string;
}
export class SkillBuilder {
	private currentIndex = 0;
	private instructionSequence: InstructionObject[] = [];
	private getInstructionObjectAtCurrentIndex() {
		let obj = this.instructionSequence[this.currentIndex];
		if (obj === undefined) {
			obj = {};
			this.instructionSequence[this.currentIndex] = obj;
			return obj;
		}
		return obj;
	}
	public after(fn: (params: ActionFunctionParams) => void) {
		this.getInstructionObjectAtCurrentIndex().afterFn = fn;
		return this;
	}
	public action(actionName: string, metadata: unkObj = {}) {
		const a = getAction(actionName);
		++this.currentIndex;
		this.getInstructionObjectAtCurrentIndex().actionTuple = [a, metadata];
		return this;
	}
	public save(index: string) {
		this.getInstructionObjectAtCurrentIndex().saveResultAs = index;
		return this;
	}
	public run(args: unkObj) {
		const parser = new SkillParser(this.instructionSequence, args);
		return parser;
	}
}
export class SkillParser {
	private canRun = true;
	private pointer = -1;
	public bin = new Bin();
	private saved = new Map<string, unkObj>();
	private previous?: unkObj;
	constructor(private sequence: SkillBuilder["instructionSequence"], public args: unkObj) {
		this.next();
	}
	public getSaved() {
		return this.saved;
	}
	public next(previousParams?: NextParams) {
		if (!this.canRun) return;
		++this.pointer;
		this.run(previousParams);
	}
	public getPrevious() {
		return this.previous;
	}
	private async run(previousParams: NextParams = {}) {
		if (!this.canRun) return;
		if (previousParams === EXIT_SKILL) return this.stop();
		const r = this.sequence[this.pointer - 1];
		if (r && r.saveResultAs !== undefined) {
			this.saved.set(r.saveResultAs, previousParams);
		}
		this.previous = previousParams;
		if (this.pointer >= this.sequence.size()) return this.stop();
		const sequenceEntry = this.sequence[this.pointer];
		if (sequenceEntry.actionTuple) {
			const [fn, meta] = sequenceEntry.actionTuple;
			const [s, e] = pcall(fn, this, meta);
			if (!s) {
				warn(e);
				return this.stop();
			}
		}
		if (sequenceEntry.afterFn) {
			sequenceEntry.afterFn(this);
		}
		if (sequenceEntry.actionTuple === undefined) {
			this.next();
		}
	}
	public stop() {
		this.canRun = false;
		this.pointer = -1;
		this.bin.destroy();
	}
}
