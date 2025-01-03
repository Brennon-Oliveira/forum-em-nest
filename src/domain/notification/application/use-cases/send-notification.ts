import { type Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export interface SendNotificationUseCaseRequest {
	recipientId: string;
	title: string;
	content: string;
}

export interface SendNotificationUseCaseResponse {
	notification: Notification;
}

export class SendNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		title,
		content,
		recipientId,
	}: SendNotificationUseCaseRequest): Promise<
		Either<never, SendNotificationUseCaseResponse>
	> {
		const notification = Notification.create({
			title,
			content,
			recipientId: new UniqueEntityID(recipientId),
		});

		await this.notificationsRepository.create(notification);

		return right({
			notification,
		});
	}
}
