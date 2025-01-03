import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import {
	AnswerComment,
	type AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import {
	Question,
	type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from "@faker-js/faker";

export function makeAnswerComment(
	override: Partial<AnswerCommentProps> = {},
	id?: UniqueEntityID,
) {
	return AnswerComment.create(
		{
			authorId: new UniqueEntityID(),
			content: faker.lorem.text(),
			answerId: new UniqueEntityID(),
			...override,
		},
		id,
	);
}
