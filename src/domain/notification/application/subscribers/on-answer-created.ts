import { DomainEvents } from "@/core/event/domain-events";
import type { EventHandler } from "@/core/event/event-handler";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import type { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}
	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		);
	}

	private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);

		if (!question) {
			return;
		}

		await this.sendNotification.execute({
			recipientId: question.authorId.toString(),
			title: `Nova responsta em "${question.title.substring(0, 40).concat("...")}"`,
			content: answer.excerpt,
		});
	}
}
