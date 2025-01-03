import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { makeAnswer } from "@test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswerCommentsRepository } from "@test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { beforeEach, describe, expect, it, test } from "vitest";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment On Answer", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);

		sut = new CommentOnAnswerUseCase(
			inMemoryAnswerCommentsRepository,
			inMemoryAnswersRepository,
		);
	});

	it("should be able to comment on answer", async () => {
		const answer = makeAnswer({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			authorId: "author-2",
			content: "Comentário teste",
			answerId: answer.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
			"Comentário teste",
		);
	});

	it("should not be able to comment in an unexistent answer", async () => {
		const answer = makeAnswer({}, new UniqueEntityID("answer-1"));

		await inMemoryAnswersRepository.create(answer);

		const result = await sut.execute({
			content: "Comentário teste",
			authorId: "author-2",
			answerId: "answer-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
