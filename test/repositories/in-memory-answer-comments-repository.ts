import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	public items: AnswerComment[] = [];

	async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment);
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find((item) => item.id.toValue() === id);

		if (!answerComment) {
			return null;
		}

		return answerComment;
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		);

		this.items.splice(itemIndex, 1);
	}

	async findManyByAnswerId(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<AnswerComment[]> {
		const answerComments = this.items
			.filter((answerComment) => answerComment.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20);

		return answerComments;
	}
}
