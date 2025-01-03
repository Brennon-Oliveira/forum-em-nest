import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export interface AnswerCommentsRepository {
	findById(id: string): Promise<AnswerComment | null>;
	create(answerComment: AnswerComment): Promise<void>;
	delete(answerComment: AnswerComment): Promise<void>;
	findManyByAnswerId(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<AnswerComment[]>;
}
