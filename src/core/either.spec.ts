import { type Either, left, right } from "@/core/either";
import { describe, expect, test } from "vitest";

function doSomething(shouldSuccess: boolean): Either<string, number> {
	if (shouldSuccess) {
		return right(10);
	}
	return left("error");
}

describe("Either", () => {
	test("Success result", () => {
		const result = doSomething(true);

		if (result.isRight()) {
			result.value;
		}

		expect(result.value).toEqual(10);
		expect(result.isRight()).toBe(true);
		expect(result.isLeft()).toBe(false);
	});

	test("Error result", () => {
		const result = doSomething(false);

		expect(result.value).toEqual("error");
		expect(result.isRight()).toBe(false);
		expect(result.isLeft()).toBe(true);
	});
});
