import { SkillRunner, UnknownObjectType } from "shared/skill-builder";

export function messageSendAction(skillBuilder: SkillRunner, params: { message: string }) {
	skillBuilder.next({
		message: params.message,
	});
}
export function messageReceiveAction(skillBuilder: SkillRunner, params: undefined, previous?: UnknownObjectType) {
	const m = previous as { message: string };
	print(m.message);
	skillBuilder.next();
}
