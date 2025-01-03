import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface NotificationProps {
	recipientId: UniqueEntityID;
	title: string;
	content: string;
	readAt?: Date;
	createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
	static create(
		props: Optional<NotificationProps, "createdAt">,
		id?: UniqueEntityID,
	) {
		const notification = new Notification(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return notification;
	}

	get recipientId() {
		return this.props.recipientId;
	}

	get title() {
		return this.props.title;
	}

	get content() {
		return this.props.content;
	}

	get readAt() {
		return this.props.readAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	read() {
		this.props.readAt = new Date();
	}
}
