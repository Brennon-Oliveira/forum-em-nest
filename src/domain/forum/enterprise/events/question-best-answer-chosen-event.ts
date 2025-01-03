import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { DomainEvent } from "@/core/event/domain-event";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
	public ocurredAt: Date;
	public question: Question;
	public bestAnswerId: UniqueEntityID;

	constructor(question: Question, bestAnswerId: UniqueEntityID) {
		this.ocurredAt = new Date();
		this.question = question;
		this.bestAnswerId = bestAnswerId;
	}

	public getAggregateId(): UniqueEntityID {
		return this.question.id;
	}
}
