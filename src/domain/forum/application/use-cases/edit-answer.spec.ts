import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { makeAnswer } from "@test/factories/make-answer";
import { makeAnswerAttachment } from "@test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentRepository,
		);
		sut = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentRepository,
		);
	});

	it("should be able to edit a answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		inMemoryAnswerAttachmentRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID("attachment-2"),
			}),
		);

		await sut.execute({
			answerId: "answer-1",
			authorId: "author-1",
			content: "Conteúdo teste",
			attachmentsIds: ["attachment-1", "attachment-3"],
		});

		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: "Conteúdo teste",
		});
		expect(inMemoryAnswersRepository.items[0].attachments.items).toHaveLength(
			2,
		);
		expect(inMemoryAnswersRepository.items[0].attachments.items).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityID("attachment-3"),
			}),
		]);
	});

	it("should not be able to edit a answer from another user", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: "answer-1",
			authorId: "author-2",
			content: "Conteúdo teste",
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});
});
