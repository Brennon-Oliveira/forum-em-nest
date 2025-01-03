import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { makeAnswer } from "@test/factories/make-answer";
import { makeQuestion } from "@test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionCommentsRepository } from "@test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { beforeEach, describe, expect, it, test } from "vitest";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment On Question", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);

		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionCommentsRepository,
			inMemoryQuestionsRepository,
		);
	});

	it("should be able to comment on question", async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryQuestionsRepository.create(question);

		await sut.execute({
			authorId: "author-2",
			content: "Comentário teste",
			questionId: question.id.toString(),
		});

		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
			"Comentário teste",
		);
	});

	it("should not be able to comment in an unexistent question", async () => {
		const question = makeQuestion({}, new UniqueEntityID("question-1"));

		await inMemoryQuestionsRepository.create(question);

		const result = await sut.execute({
			content: "Comentário teste",
			authorId: "author-2",
			questionId: "question-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
