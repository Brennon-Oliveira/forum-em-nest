import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { makeQuestion } from "@test/factories/make-question";
import { makeQuestionAttachment } from "@test/factories/make-question-attachment";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository,
		);
		sut = new DeleteQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentRepository,
		);
	});

	it("should be able to delete a question", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-2"),
			}),
		);

		await sut.execute({
			questionId: "question-1",
			authorId: "author-1",
		});

		expect(inMemoryQuestionsRepository.items).toHaveLength(0);
		expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
	});

	it("should not be able to delete a question from another user", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-2"),
			}),
		);

		const result = await sut.execute({
			questionId: "question-2",
			authorId: "author-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(inMemoryQuestionsRepository.items).toHaveLength(1);
		expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
	});

	it("should not be able to delete a question from another user", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-2"),
			}),
		);

		const result = await sut.execute({
			questionId: "question-1",
			authorId: "author-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryQuestionsRepository.items).toHaveLength(1);
		expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
	});
});
