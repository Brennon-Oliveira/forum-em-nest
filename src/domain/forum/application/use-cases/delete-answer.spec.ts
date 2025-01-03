import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { makeAnswer } from "@test/factories/make-answer";
import { makeAnswerAttachment } from "@test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentRepository,
		);
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to delete a answer", async () => {
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
		});

		expect(inMemoryAnswersRepository.items).toHaveLength(0);
		expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0);
	});

	it("should not be able to delete an unexistent answer", async () => {
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

		const result = await sut.execute({
			answerId: "answer-2",
			authorId: "author-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);

		expect(inMemoryAnswersRepository.items).toHaveLength(1);
		expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2);
	});

	it("should not be able to delete a answer from another user", async () => {
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

		const result = await sut.execute({
			answerId: "answer-1",
			authorId: "author-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
		expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2);
	});
});
