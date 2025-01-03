import { AggregateRoot } from "@/core/entities/agreggate-root";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { AnswerAttachmentsList } from "@/domain/forum/enterprise/entities/answer-attachments-list";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";

export interface AnswerProps {
	authorId: UniqueEntityID;
	questionId: UniqueEntityID;
	content: string;
	attachments: AnswerAttachmentsList;
	createdAt: Date;
	updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
	static create(
		props: Optional<AnswerProps, "createdAt" | "attachments">,
		id?: UniqueEntityID,
	) {
		const answer = new Answer(
			{
				...props,
				attachments: props.attachments ?? new AnswerAttachmentsList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		const isNewAnswer = !id;

		if (isNewAnswer) {
			answer.addDomainEvent(new AnswerCreatedEvent(answer));
		}

		return answer;
	}

	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get attachments() {
		return this.props.attachments;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set attachments(attachments: AnswerAttachmentsList) {
		this.props.attachments = attachments;
		this.touch();
	}
}
