import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answert";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { makeAnswer } from "@test/factories/make-answer";
import { makeQuestion } from "@test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentRepository,
		);
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository,
		);

		sut = new ChooseQuestionBestAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryQuestionsRepository,
		);
	});

	it("should be able to delete a answer", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			answerId: answer.id.toString(),
			authorId: question.authorId.toString(),
		});

		expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
			answer.id,
		);
	});

	it("should not be able to choose another use question best answer", async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityID("author-1"),
		});
		const answer = makeAnswer({
			questionId: question.id,
		});

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		const result = await sut.execute({
			answerId: answer.id.toString(),
			authorId: "author-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
