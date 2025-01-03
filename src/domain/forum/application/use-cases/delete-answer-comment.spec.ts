import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { makeAnswerComment } from "@test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "@test/repositories/in-memory-answer-comments-repository";
import { beforeEach, describe, expect, it, test } from "vitest";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete question comment", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to comment on question", async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryAnswerCommentsRepository.create(answerComment);

		await sut.execute({
			authorId: "author-1",
			answerCommentId: answerComment.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete an unexistent question comment", async () => {
		const answerComment = makeAnswerComment(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-comment-1"),
		);

		await inMemoryAnswerCommentsRepository.create(answerComment);

		const result = await sut.execute({
			authorId: "author-1",
			answerCommentId: "question-comment-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able to delete another user question comment", async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryAnswerCommentsRepository.create(answerComment);

		const result = await sut.execute({
			authorId: "author-2",
			answerCommentId: answerComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
