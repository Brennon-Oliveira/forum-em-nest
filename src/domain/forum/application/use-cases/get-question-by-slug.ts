import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		question: Question;
	}
>;

export class GetQuestionBySlug {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionsRepository.findBySlug(slug);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		return right({
			question,
		});
	}
}
