import type { UseCaseError } from "@/core/errors/use-case-error";

export class NotAllowedError extends Error implements UseCaseError {
	readonly type = "NotAllowedError" as const;
	constructor() {
		super("Not allowed");
	}
}
