import type { AggregateRoot } from "@/core/entities/agreggate-root";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { DomainEvent } from "@/core/event/domain-event";

type DomainEventCallback<T> = (event: T) => void;

export class DomainEvents {
	public teste = "";
	private static handlersMap: Record<
		string,
		DomainEventCallback<DomainEvent>[]
	> = {};
	private static markedAggregates: AggregateRoot<unknown>[] = [];

	public static markedAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
		const aggregateFound = !!DomainEvents.findMarkedAggregateByID(aggregate.id);

		if (!aggregateFound) {
			DomainEvents.markedAggregates.push(aggregate);
		}
	}

	private static dispatchAggregateEvents<T>(aggregate: AggregateRoot<T>) {
		for (const event of aggregate.domainEvents) {
			DomainEvents.dispatch(event);
		}
	}

	private static removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<unknown>,
	) {
		const index = DomainEvents.markedAggregates.findIndex((a) =>
			a.equals(aggregate),
		);

		DomainEvents.markedAggregates.splice(index, 1);
	}

	private static findMarkedAggregateByID(id: UniqueEntityID) {
		return DomainEvents.markedAggregates.find((aggregate) =>
			aggregate.id.equals(id),
		);
	}

	public static dispatchEventsForAggregate(id: UniqueEntityID) {
		const aggregate = DomainEvents.findMarkedAggregateByID(id);

		if (aggregate) {
			DomainEvents.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			DomainEvents.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register<T extends DomainEvent>(
		callback: DomainEventCallback<T>,
		eventClassName: string,
	) {
		const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap;

		if (!wasEventRegisteredBefore) {
			DomainEvents.handlersMap[eventClassName] = [];
		}

		DomainEvents.handlersMap[eventClassName].push(
			callback as DomainEventCallback<DomainEvent>,
		);
	}

	public static clearHandlers() {
		DomainEvents.handlersMap = {};
	}

	public static clearMarkedAggregates() {
		DomainEvents.markedAggregates = [];
	}

	public static dispatch(event: DomainEvent) {
		const eventClassName: string = event.constructor.name;

		const isEventRegistered = eventClassName in DomainEvents.handlersMap;

		if (isEventRegistered) {
			const handlers = DomainEvents.handlersMap[eventClassName];

			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
