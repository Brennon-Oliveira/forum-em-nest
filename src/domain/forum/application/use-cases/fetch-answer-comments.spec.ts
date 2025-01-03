import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { FetchAnswerCommentUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { makeAnswerComment } from "@test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "@test/repositories/in-memory-answer-comments-repository";
import { beforeEach, describe, expect, it } from "vitest";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentUseCase;

describe("Fetch Answer Comments", () => {
	beforeEach(() => {
		inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository();
		sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentRepository);
	});

	it("should to fetch answer comments", async () => {
		const answerId = "answer-1";

		await inMemoryAnswerCommentRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityID(answerId),
			}),
		);
		await inMemoryAnswerCommentRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityID(answerId),
			}),
		);
		await inMemoryAnswerCommentRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityID(answerId),
			}),
		);

		const result = await sut.execute({
			page: 1,
			answerId,
		});

		expect(result.value?.answerComments).toHaveLength(3);
	});

	it("should be able to fetch paginated answer comments", async () => {
		const answerId = "answer-1";
		for (let i = 1; i <= 23; i++) {
			await inMemoryAnswerCommentRepository.create(
				makeAnswerComment({
					answerId: new UniqueEntityID(answerId),
				}),
			);
		}

		const {
			value: { answerComments: firstPage },
		} = await sut.execute({
			answerId,
			page: 1,
		});

		const {
			value: { answerComments: secondPage },
		} = await sut.execute({
			answerId,
			page: 2,
		});

		expect(firstPage).toHaveLength(20);
		expect(secondPage).toHaveLength(3);
	});
});
