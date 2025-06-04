import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { SkillRunner } from "shared/skill-builder";
import { TestSkill } from "shared/skills/test-skill";
@Service()
export class ToolGiver implements OnStart {
	onStart(): void {
		Players.PlayerAdded.Connect((p) => {
			p.Character || p.CharacterAdded.Wait()[0];
			const tool = new Instance("Tool");
			tool.Activated.Connect(() => {
				print("activated!");
				new SkillRunner(TestSkill, {
					character: tool.Parent as Instance,
				});
			});
			tool.Name = "Test Skill";
			tool.RequiresHandle = false;
			tool.Parent = p.WaitForChild("Backpack");
		});
	}
}
