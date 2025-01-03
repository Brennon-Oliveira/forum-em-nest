import { randomUUID } from "node:crypto";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

export abstract class Entity<T> {
	private _id: UniqueEntityID;
	protected props: T;

	get id() {
		return this._id;
	}

	protected constructor(props: T, id?: UniqueEntityID) {
		this.props = props;
		this._id = id ?? new UniqueEntityID();
	}

	public equals(entity: Entity<T>) {
		if (entity === this) {
			return true;
		}

		if (entity.id === this._id) {
			return true;
		}

		return false;
	}
}
