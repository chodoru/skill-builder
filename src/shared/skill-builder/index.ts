import { Bin } from "@rbxts/bin";
import { actionFn, FnParamsObj, getAction, SaveData } from "./action-builder";
import { ReplicatedStorage } from "@rbxts/services";

export interface SkillActionData {
	fn: actionFn;
	data: { [key: string]: unknown };
}
//StaticData, val.data, previousResult, dat
const sa = ReplicatedStorage.FindFirstChild("skill-actions", true);
sa?.GetChildren().forEach((element) => {
	require(element as ModuleScript);
});

export class SkillBuilder {
	private currentIndex = -1;
	private actionQueue: SkillActionData[] = [];
	private saved = new Map<string, number>();
	private invertedSaved = new Map<number, string>();
	private useSavedDataFor = new Map<number, string[]>();
	private afterFns = new Map<number, ((StaticData: FnParamsObj["env"]) => void)[]>();
	constructor() {}
	public save(index: string) {
		this.saved.set(index, this.currentIndex);
		this.invertedSaved.set(this.currentIndex, index);
		return this;
	}
	public load(index: string) {
		const obj = this.useSavedDataFor.get(this.currentIndex + 1);
		if (obj) {
			obj.push(index);
			return this;
		}
		this.useSavedDataFor.set(this.currentIndex + 1, [index]);
		return this;
	}
	public queue(action: string, data: { [key: string]: unknown } = {}) {
		print(action, data, "queueing");
		const actFn = getAction(action);
		this.currentIndex =
			this.actionQueue.push({
				fn: actFn,
				data: data,
			}) - 1;
		return this;
	}
	private internalRun(StaticData: FnParamsObj["env"], character: Instance) {
		warn("RUNNING!");

		let stopNext = false;
		let curExecutionIndex = 0;
		const sequentialDataSave = new Map<number, SaveData>();
		let previousResult: SaveData | undefined;
		for (let i = 0; i < this.actionQueue.size(); i++) {
			if (stopNext) return;
			curExecutionIndex = i;
			const savedDataIndex = this.useSavedDataFor.get(curExecutionIndex);
			const saved = new Map<string, SaveData>();
			if (savedDataIndex !== undefined) {
				savedDataIndex.forEach((v) => {
					const saveIndex = this.saved.get(v);
					if (saveIndex !== undefined) {
						const dat = sequentialDataSave.get(saveIndex);
						if (dat === undefined) return;
						saved.set(v, dat);
					}
				});
			}
			const val = this.actionQueue[i];
			const [s, r] = pcall(val.fn, {
				env: StaticData,
				loaded: saved,
				previous: previousResult,
			});
			switch (s) {
				case true: {
					if (this.invertedSaved.has(curExecutionIndex)) {
						sequentialDataSave.set(curExecutionIndex, r);
						warn("SAVED,r", r);
					}
					const arr = this.afterFns.get(curExecutionIndex);
					if (arr) arr.forEach((v) => v(StaticData));
					previousResult = r;
					break;
				}
				case false:
					throw r;
			}
		}
		return () => (stopNext = true);
	}
	public after(fn: (StaticData: FnParamsObj["env"]) => void) {
		if (this.afterFns.has(this.currentIndex)) {
			this.afterFns.get(this.currentIndex)?.push(fn);
		} else {
			this.afterFns.set(this.currentIndex, [fn]);
		}
		return this;
	}
	public run(character: Instance) {
		const StaticData = {
			character: character,
			bin: new Bin(),
		};
		try {
			this.internalRun(StaticData, character);
		} catch (error) {
			warn(error, "fail!");
		} finally {
			StaticData.bin.destroy();
		}
	}
}
