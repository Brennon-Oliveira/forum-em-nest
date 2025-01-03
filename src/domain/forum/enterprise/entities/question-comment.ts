import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import {
	Comment,
	type CommentProps,
} from "@/domain/forum/enterprise/entities/comment";

export interface QuestionCommentProps extends CommentProps {
	questionId: UniqueEntityID;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
	static create(
		props: Optional<QuestionCommentProps, "createdAt">,
		id?: UniqueEntityID,
	) {
		const questionComment = new QuestionComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return questionComment;
	}

	get questionId() {
		return this.props.questionId;
	}
}
