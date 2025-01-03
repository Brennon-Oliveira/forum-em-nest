import { GetQuestionBySlug } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository";
import { beforeEach, describe, expect, test } from "vitest";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlug;

describe("Get Question By Slug", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository,
		);
		sut = new GetQuestionBySlug(inMemoryQuestionsRepository);
	});

	test("it should to get a question by slug", async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create("example-question"),
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: "example-question",
		});

		expect(result.isRight() ? result.value.question.id : "").toEqual(
			newQuestion.id,
		);
		expect(result.isRight() ? result.value.question.title : "").toEqual(
			newQuestion.title,
		);
		expect(result.isRight() ? result.value.question.content : "").toEqual(
			newQuestion.content,
		);
	});
});
