import { Error } from "@rbxts/jsnatives";
import { Players, ReplicatedStorage, ServerScriptService } from "@rbxts/services";
const err = Error.Error;

const LocalPlayer = Players.LocalPlayer;

export function parsePath(path: string) {
	const arr = path.split("/");
	let dir: Instance = script;
	arr.forEach((v, i) => {
		switch (v) {
			case "..":
				if (dir.Parent === undefined) throw new err(`${dir.Name} is parented to nil!`);
				dir = dir.Parent;
				break;
			case ".":
				dir = script;
				break;
			case "src": {
				const nextEntry = arr[i + 1];
				if (nextEntry === undefined) throw new err("src cannot be last");
				switch (nextEntry) {
					case "client":
						dir = LocalPlayer?.WaitForChild("PlayerScripts", math.huge)?.WaitForChild(
							"TS",
							math.huge,
						) as Instance;
						break;
					case "server":
						dir = ServerScriptService.WaitForChild("TS", math.huge) as Instance;
						break;
					case "shared":
						dir = ReplicatedStorage.WaitForChild("TS", math.huge) as Instance;
				}
				assert(dir, "failed to get dir");
				break;
			}
			default:
				dir = dir.FindFirstChild(v) as Instance;
				assert(dir, "failed to get dir!");
		}
	});
	assert(dir, "FAILED TO GET DIR");
	return dir;
}
