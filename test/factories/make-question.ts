import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import {
	Question,
	type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { faker } from "@faker-js/faker";

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityID,
) {
	return Question.create(
		{
			title: faker.lorem.sentence(),
			authorId: new UniqueEntityID(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
}
