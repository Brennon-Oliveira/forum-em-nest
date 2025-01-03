import { DomainEvents } from "@/core/event/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async create(answer: Answer): Promise<void> {
		this.items.push(answer);

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find((item) => item.id.toValue() === id);

		if (!answer) {
			return null;
		}

		return answer;
	}

	async delete(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items.splice(itemIndex, 1);

		this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
	}

	async save(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items[itemIndex] = answer;

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = this.items
			.filter((answer) => answer.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return answers;
	}
}
