import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	public items: QuestionComment[] = [];

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find((item) => item.id.toValue() === id);

		if (!questionComment) {
			return null;
		}

		return questionComment;
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		);

		this.items.splice(itemIndex, 1);
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = this.items
			.filter(
				(questionComment) =>
					questionComment.questionId.toString() === questionId,
			)
			.slice((page - 1) * 20, page * 20);

		return questionComments;
	}
}
