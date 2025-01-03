import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
import { makeQuestionComment } from "@test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "@test/repositories/in-memory-question-comments-repository";
import { beforeEach, describe, expect, it, test } from "vitest";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete question comment", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();

		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to comment on question", async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryQuestionCommentsRepository.create(questionComment);

		await sut.execute({
			authorId: "author-1",
			questionCommentId: questionComment.id.toString(),
		});

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete an unexistent question comment", async () => {
		const questionComment = makeQuestionComment(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-comment-1"),
		);

		await inMemoryQuestionCommentsRepository.create(questionComment);

		const result = await sut.execute({
			authorId: "author-1",
			questionCommentId: "question-comment-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able to delete another user question comment", async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryQuestionCommentsRepository.create(questionComment);

		const result = await sut.execute({
			authorId: "author-2",
			questionCommentId: questionComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
