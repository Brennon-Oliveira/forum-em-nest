import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment;
	}
>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionCommentsRepository: QuestionCommentsRepository,
		private questionsRepository: QuestionsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityID(authorId),
			questionId: question.id,
			content,
		});

		await this.questionCommentsRepository.create(questionComment);

		return right({ questionComment });
	}
}
