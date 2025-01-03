import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answerComment: AnswerComment;
	}
>;

export class CommentOnAnswerUseCase {
	constructor(
		private answerCommentsRepository: AnswerCommentsRepository,
		private answersRepository: AnswersRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityID(authorId),
			answerId: answer.id,
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({ answerComment });
	}
}
