import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { TestSkill } from "shared/skills/test-skills";

@Service()
export class ToolGiver implements OnStart {
	onStart(): void {
		Players.PlayerAdded.Connect((p) => {
			p.Character || p.CharacterAdded.Wait()[0];
			const tool = new Instance("Tool");
			tool.Activated.Connect(() =>
				TestSkill.run({
					["character"]: tool.Parent as Instance,
				}),
			);
			tool.RequiresHandle = false;
			tool.Parent = p.WaitForChild("Backpack");
		});
	}
}
