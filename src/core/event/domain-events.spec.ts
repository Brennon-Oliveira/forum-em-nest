import { AggregateRoot } from "@/core/entities/agreggate-root";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { DomainEvent } from "@/core/event/domain-event";
import { DomainEvents } from "@/core/event/domain-events";
import { describe, expect, it, vi } from "vitest";

class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date;
	private aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.ocurredAt = new Date();
		this.aggregate = aggregate;
	}

	public getAggregateId(): UniqueEntityID {
		return this.aggregate.id;
	}
}

class CustomAggregate extends AggregateRoot<null> {
	static create() {
		const customAggregate = new CustomAggregate(null);

		customAggregate.addDomainEvent(new CustomAggregateCreated(customAggregate));

		return customAggregate;
	}
}

describe("Domain Events", () => {
	it("should be able to dispatch and listen to events", () => {
		const callbackSpy = vi.fn();

		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents).toHaveLength(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toBeCalled();
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});
