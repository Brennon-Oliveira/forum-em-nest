import { AggregateRoot } from "@/core/entities/agreggate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { QuestionAttachmentsList } from "@/domain/forum/enterprise/entities/question-attachments-list";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import dayjs from "dayjs";

export interface QuestionProps {
	authorId: UniqueEntityID;
	bestAnswerId?: UniqueEntityID;
	content: string;
	title: string;
	slug: Slug;
	createdAt: Date;
	updatedAt?: Date;
	attachments: QuestionAttachmentsList;
}

export class Question extends AggregateRoot<QuestionProps> {
	static create(
		props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
		id?: UniqueEntityID,
	) {
		const question = new Question(
			{
				...props,
				attachments: props.attachments ?? new QuestionAttachmentsList(),
				slug: props.slug ?? Slug.createSlugFromText(props.title),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return question;
	}

	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	get content() {
		return this.props.content;
	}

	get title() {
		return this.props.title;
	}

	get slug() {
		return this.props.slug;
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

	get isNew() {
		return dayjs().diff(this.createdAt, "days") <= 3;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createSlugFromText(title);
		this.touch();
	}

	set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
		const isNewBestAnswer =
			bestAnswerId &&
			!bestAnswerId.equals(this.props.bestAnswerId ?? UniqueEntityID.empty);

		this.props.bestAnswerId = bestAnswerId;
		this.touch();
		if (isNewBestAnswer) {
			console.log("ola");
			this.addDomainEvent(
				new QuestionBestAnswerChosenEvent(this, bestAnswerId),
			);
		}
	}

	set attachments(attachments: QuestionAttachmentsList) {
		this.props.attachments = attachments;
		this.touch();
	}
}
