import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Question", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentRepository,
		);
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	test("it should to answer a question", async () => {
		const result = await sut.execute({
			content: "Minha resposta",
			instructorId: "1",
			questionId: "1",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.items[0].id).toEqual(
			result.value?.answer.id,
		);
		expect(inMemoryAnswersRepository.items[0].attachments.items).toHaveLength(
			2,
		);
		expect(inMemoryAnswersRepository.items[0].attachments.items).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityID("1"),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityID("2"),
			}),
		]);
	});
});
