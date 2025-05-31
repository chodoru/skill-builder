import { SkillBuilder } from "shared/skill-builder/main";

export const SkillTest = new SkillBuilder()
	.queue("blank")
	.after((StaticData) => {
		StaticData.bin.destroy();
		task.wait(3); // windup idk?
		print("cleaned up before action test");
	})
	.queue("actiontest")
	.after((StaticData) => print(StaticData, "STATIC!"))
	.save("testactionData")
	.queue("actiontest2")
	.load("testactionData")
	.queue("actiontest3");
