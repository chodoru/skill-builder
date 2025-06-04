import { Bin } from "@rbxts/bin";

export type UnknownObjectType = { [key: string]: unknown };
export type SkillAction<T> = (SkillRunner: SkillRunner, params: T, previous?: UnknownObjectType) => void;

interface SkillBuilderSequenceObject<T> {
	instructionType: InstructionType;
	fn: SkillAction<T>;
	params: T;
}

export interface SkillRunnerInitParams {
	character: Instance;
}

enum InstructionType {
	Goto,
	Async,
	Sync,
}
export class SkillBuilder {
	private sequence: SkillBuilderSequenceObject<unknown>[] = [];
	public getSequence() {
		return this.sequence;
	}
	private implSchedule<T>(data: SkillBuilderSequenceObject<T>) {
		this.sequence.push(data as never);
	}
	public action<T>(fn: SkillAction<T>, passedParams: T) {
		this.implSchedule({
			instructionType: InstructionType.Sync,
			fn: fn,
			params: passedParams,
		});
		return this;
	}
	public call(fn: SkillAction<undefined>) {
		this.implSchedule({
			instructionType: InstructionType.Sync,
			fn: fn,
			params: undefined,
		});
		return this;
	}
	public async(fn: SkillAction<undefined>) {
		this.implSchedule({
			instructionType: InstructionType.Async,
			fn: fn,
			params: undefined,
		});
		return this;
	}
	public gotoIndex(index: string) {
		this.implSchedule({
			instructionType: InstructionType.Goto,
			fn: (s) => undefined,
			params: { gotoIndex: index },
		});
		return this;
	}
}
export class SkillRunner {
	public currentIndex = -1;
	public data: UnknownObjectType = {};
	private sequence;
	private bin = new Bin();
	public constructor(private builder: SkillBuilder, public initParams: SkillRunnerInitParams) {
		this.sequence = builder.getSequence();
		this.next();
	}
	public exit() {
		this.bin.destroy();
		this.currentIndex = -1;
		return;
	}
	private async run<T extends UnknownObjectType>(args?: T) {
		const val = this.sequence[this.currentIndex];
		if (val.instructionType === InstructionType.Goto) return this.next(args);
		if (val.instructionType === InstructionType.Async) {
			val.fn(this, undefined, args);
			return this.next(args);
		}
		val.fn(this, val.params, args);
	}
	public next<T extends UnknownObjectType>(args?: T) {
		this.currentIndex++;
		this.run(args);
		return this;
	}
	public goto<T extends UnknownObjectType>(index: string, args?: T) {
		const i = this.sequence.findIndex((v) => {
			const entry = v as SkillBuilderSequenceObject<{ gotoIndex: string }>;
			return entry.instructionType === InstructionType.Goto && entry.params?.gotoIndex === index;
		});
		assert(i > -1, "could not perform goto, index is missing");
		this.currentIndex = i;
		this.run(args);
		return this;
	}
}
