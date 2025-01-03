import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { FetchQuestionCommentUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { makeQuestionComment } from "@test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "@test/repositories/in-memory-question-comments-repository";
import { beforeEach, describe, expect, it, test } from "vitest";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentUseCase;

describe("Fetch Question Comments", () => {
	beforeEach(() => {
		inMemoryQuestionCommentRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentRepository);
	});

	it("should to fetch question comments", async () => {
		const questionId = "question-1";

		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID(questionId),
			}),
		);

		const {
			value: { questionComments },
		} = await sut.execute({
			page: 1,
			questionId,
		});

		expect(questionComments).toHaveLength(3);
	});

	it("should be able to fetch paginated question comments", async () => {
		const questionId = "question-1";
		for (let i = 1; i <= 23; i++) {
			await inMemoryQuestionCommentRepository.create(
				makeQuestionComment({
					questionId: new UniqueEntityID(questionId),
				}),
			);
		}

		const {
			value: { questionComments: firstPage },
		} = await sut.execute({
			questionId,
			page: 1,
		});

		const {
			value: { questionComments: secondPage },
		} = await sut.execute({
			questionId,
			page: 2,
		});

		expect(firstPage).toHaveLength(20);
		expect(secondPage).toHaveLength(3);
	});
});
