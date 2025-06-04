import { messageReceiveAction, messageSendAction } from "shared/skill-actions/grabs";
import { SkillBuilder, SkillRunner } from "shared/skill-builder";

export const TestSkill = new SkillBuilder()
	.gotoIndex("initial")
	.action(messageSendAction, { message: "shalom" })
	.async((s, params, prev) => {
		const m = prev as { message: string };
		print("earing in on the message", m.message);
	})
	.call((s, params, prev) => {
		s.data.amount = s.data.amount ?? 0;
		print("middlewared", prev);
		s.next(prev);
	})
	.action(messageReceiveAction, undefined)
	.call((s) => {
		const willExit = math.random(1, 5) === 5;
		warn("will exit?", willExit, s.data);
		return willExit
			? s.exit()
			: s.goto("initial", {
					num: ++(s.data.amount as number),
					exitNum: willExit,
			  });
	});
