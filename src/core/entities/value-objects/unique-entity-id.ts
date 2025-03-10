import { randomUUID } from "node:crypto";

export class UniqueEntityID {
	private value: string;

	toString() {
		return this.value;
	}

	toValue() {
		return this.value;
	}

	equals(id: UniqueEntityID) {
		return id.toValue() === this.value;
	}

	static get empty() {
		return new UniqueEntityID("");
	}

	constructor(value?: string) {
		this.value = value ?? randomUUID();
	}
}
