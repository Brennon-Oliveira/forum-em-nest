import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import type { Question } from "@/domain/forum/enterprise/entities/question";

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private questionsRepository: QuestionsRepository,
	) {}

	async execute({
		answerId,
		authorId,
	}: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== question.authorId.toString()) {
			return left(new NotAllowedError());
		}

		question.bestAnswerId = answer.id;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}
