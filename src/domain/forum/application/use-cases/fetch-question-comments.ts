import { type Either, right } from "@/core/either";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import type { Question } from "@/domain/forum/enterprise/entities/question";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

interface FetchQuestionCommentUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionCommentUseCaseResponse = Either<
	never,
	{
		questionComments: QuestionComment[];
	}
>;

export class FetchQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
		const questionComments =
			await this.questionCommentsRepository.findManyByQuestionId(questionId, {
				page,
			});

		return right({
			questionComments,
		});
	}
}
