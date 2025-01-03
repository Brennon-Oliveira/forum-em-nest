import { type Either, right } from "@/core/either";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

interface FetchRecentQuestionsUseCaseRequest {
	page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
	never,
	{
		questions: Question[];
	}
>;

export class FetchRecentQuestions {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({
			page,
		});

		return right({
			questions,
		});
	}
}
