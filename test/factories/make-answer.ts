import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import {
	Answer,
	type AnswerProps,
} from "@/domain/forum/enterprise/entities/answer";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from "@faker-js/faker";

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityID,
) {
	return Answer.create(
		{
			questionId: new UniqueEntityID(),
			authorId: new UniqueEntityID(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
}
