import { SkillBuilder } from "shared/skill-builder/main/skill-builder";

export const TestSkill = new SkillBuilder()
	.after((p) => {
		print("init!");
	})
	.action("test-action")
	.save("savetesting")
	.after((p) => {
		print(p, p.getPrevious(), p.getSaved());
	});
