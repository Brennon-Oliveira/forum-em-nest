import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import type { Notification } from "@/domain/notification/enterprise/entities/notification";

interface ReadNotificationUseCaseRequest {
	notificationId: string;
	recipientId: string;
}

interface ReadNotificationUseCaseResponse {
	notification: Notification;
}

export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		notificationId,
		recipientId,
	}: ReadNotificationUseCaseRequest): Promise<
		Either<
			ResourceNotFoundError | NotAllowedError,
			ReadNotificationUseCaseResponse
		>
	> {
		const notification =
			await this.notificationsRepository.findById(notificationId);

		if (!notification) {
			return left(new ResourceNotFoundError());
		}

		if (recipientId !== notification.recipientId.toString()) {
			return left(new NotAllowedError());
		}

		notification.read();

		await this.notificationsRepository.save(notification);

		return right({
			notification,
		});
	}
}
