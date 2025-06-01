import { EXIT_SKILL, getAction, registerAction } from "../main/action-builder";
import { t } from "@rbxts/t";

import { RunService } from "@rbxts/services";

registerAction("test-action", (env, meta) => {
	warn(env.initParams);
	return env.next({
		["save-test"]: 0,
	});
});
