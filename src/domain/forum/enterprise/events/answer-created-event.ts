import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { DomainEvent } from "@/core/event/domain-event";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export class AnswerCreatedEvent implements DomainEvent {
	public ocurredAt: Date;
	public answer: Answer;

	constructor(answer: Answer) {
		this.ocurredAt = new Date();
		this.answer = answer;
	}

	public getAggregateId(): UniqueEntityID {
		return this.answer.id;
	}
}
