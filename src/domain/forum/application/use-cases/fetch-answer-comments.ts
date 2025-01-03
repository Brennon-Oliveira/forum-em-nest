import { type Either, right } from "@/core/either";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

interface FetchAnswerCommentUseCaseRequest {
	answerId: string;
	page: number;
}

type FetchAnswerCommentUseCaseResponse = Either<
	never,
	{
		answerComments: AnswerComment[];
	}
>;

export class FetchAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		page,
		answerId,
	}: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
		const answerComments =
			await this.answerCommentsRepository.findManyByAnswerId(answerId, {
				page,
			});

		return right({
			answerComments,
		});
	}
}
