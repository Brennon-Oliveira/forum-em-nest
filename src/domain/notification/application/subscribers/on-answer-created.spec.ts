import type { Either } from "@/core/either";
import { OnAnswerCreated } from "@/domain/notification/application/subscribers/on-answer-created";
import {
	SendNotificationUseCase,
	type SendNotificationUseCaseRequest,
	type SendNotificationUseCaseResponse,
} from "@/domain/notification/application/use-cases/send-notification";
import { makeAnswer } from "@test/factories/make-answer";
import { makeQuestion } from "@test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "@test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import {
	type MockInstance,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
	({
		title,
		content,
		recipientId,
	}: SendNotificationUseCaseRequest) => Promise<
		Either<never, SendNotificationUseCaseResponse>
	>
>;

describe("On Answer Created", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

		new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
	});
	it("should send a notification when an answer is created", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		expect(sendNotificationExecuteSpy).toBeCalledWith(
			expect.objectContaining({
				recipientId: question.authorId.toString(),
			}),
		);
	});
});
