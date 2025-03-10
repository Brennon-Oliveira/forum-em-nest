import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";

interface DeleteAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>;

export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		answerId,
		authorId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (answer.authorId.toValue() !== authorId) {
			return left(new NotAllowedError());
		}

		await this.answersRepository.delete(answer);

		return right({});
	}
}
