import { SkillBuilder } from "shared/skill-builder/main/skill-builder";

export const TestSkill = new SkillBuilder()
	.after((p, ...args) => {
		print("insane startup effect!", ...args);
	})
	.action("test-action")
	.after((p, ...args) => {
		print("insane effect 2!", ...args);
	})
	.save("savetesting");
