import { addAction } from "shared/skill-builder/action-builder";
addAction("blank", (obj) => {
	return {};
});
addAction("actiontest", (obj) => {
	obj.env.character.SetAttribute("DidAction1", true);
	obj.env.bin.add(() => obj.env.character.SetAttribute("DidAction1", undefined));
	return { isAction1: true };
});
addAction("actiontest2", (obj) => {
	const c = obj.env.character;
	if (c.GetAttribute("DidAction1") === undefined) throw "DID NOT DO ACTION1";
	return { isAction2: true };
});
addAction("actiontest3", (obj) => {
	if (obj.previous === undefined) throw "CANNOT BE FIRST";
	print("HI! TEST ACTION 3 RUNNING!", obj.loaded.get("testactionData"));
	return { isAction3: true };
});
