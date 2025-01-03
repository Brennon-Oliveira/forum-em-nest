import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { makeAnswer } from "@test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { beforeEach, describe, expect, it, test } from "vitest";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentRepository,
		);
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
	});

	it("should to fetch question answers", async () => {
		const questionId = "question-1";

		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID(questionId),
			}),
		);

		const {
			value: { answers },
		} = await sut.execute({
			page: 1,
			questionId,
		});

		expect(answers).toHaveLength(3);
	});

	it("should be able to fetch paginated question answers", async () => {
		const questionId = "question-1";
		for (let i = 1; i <= 23; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({
					questionId: new UniqueEntityID(questionId),
				}),
			);
		}

		const {
			value: { answers: firstPage },
		} = await sut.execute({
			questionId,
			page: 1,
		});

		const {
			value: { answers: secondPage },
		} = await sut.execute({
			questionId,
			page: 2,
		});

		expect(firstPage).toHaveLength(20);
		expect(secondPage).toHaveLength(3);
	});
});
