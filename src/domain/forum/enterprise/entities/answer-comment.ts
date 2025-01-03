import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import {
	Comment,
	type CommentProps,
} from "@/domain/forum/enterprise/entities/comment";

export interface AnswerCommentProps extends CommentProps {
	answerId: UniqueEntityID;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
	static create(
		props: Optional<AnswerCommentProps, "createdAt">,
		id?: UniqueEntityID,
	) {
		const answerComment = new AnswerComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return answerComment;
	}

	get answerId() {
		return this.props.answerId;
	}
}
