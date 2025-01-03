import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import {
	Question,
	type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import {
	QuestionComment,
	type QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from "@faker-js/faker";

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityID,
) {
	return QuestionComment.create(
		{
			authorId: new UniqueEntityID(),
			content: faker.lorem.text(),
			questionId: new UniqueEntityID(),
			...override,
		},
		id,
	);
}
