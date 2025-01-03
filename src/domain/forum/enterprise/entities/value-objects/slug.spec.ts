import { expect, test } from "vitest";
import { Slug } from "./slug";

test("it shouuld be able to create a new slug from text", () => {
	const slug = Slug.createSlugFromText("Example question title #$");

	expect(slug.value).toEqual("example-question-title");
});
