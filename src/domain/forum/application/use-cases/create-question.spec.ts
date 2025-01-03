import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository";
import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository,
		);
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	test("it should to answer a question", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "Nova pergunta",
			content: "Conteúdo da pergunta",
			attachmentsIds: ["1", "2"],
		});

		expect(result.value?.question.id).toBeTruthy();
		expect(inMemoryQuestionsRepository.items[0].id).toEqual(
			result.value?.question.id,
		);
		expect(inMemoryQuestionsRepository.items[0].attachments.items).toHaveLength(
			2,
		);
		expect(inMemoryQuestionsRepository.items[0].attachments.items).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityID("1"),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityID("2"),
			}),
		]);
	});
});
