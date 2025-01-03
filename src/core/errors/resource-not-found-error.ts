import type { UseCaseError } from "@/core/errors/use-case-error";

export class ResourceNotFoundError extends Error implements UseCaseError {
	readonly type = "ResourceNotFoundError" as const;
	constructor() {
		super("Resource not found");
	}
}
