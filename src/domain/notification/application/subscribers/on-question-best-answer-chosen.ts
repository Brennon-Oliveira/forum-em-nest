import { DomainEvents } from "@/core/event/domain-events";
import type { EventHandler } from "@/core/event/event-handler";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import type { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private answersRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}
	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		);
	}

	private async sendQuestionBestAnswerNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChosenEvent) {
		const answer = await this.answersRepository.findById(
			bestAnswerId.toString(),
		);

		if (!answer) {
			return;
		}

		await this.sendNotification.execute({
			recipientId: answer.authorId.toString(),
			title: "Sua resposta foi escolhida!",
			content: `A resposta que você enviou em "${question.title.substring(0, 20).concat("...")}" foi escolhida pelo autor`,
		});
	}
}
