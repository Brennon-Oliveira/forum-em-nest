import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import {
	Notification,
	type NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";

export function makeNotification(
	override: Partial<NotificationProps> = {},
	id?: UniqueEntityID,
) {
	return Notification.create(
		{
			recipientId: new UniqueEntityID(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
}
