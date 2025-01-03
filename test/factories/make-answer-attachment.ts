import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import {
	AnswerAttachment,
	type AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/awnser-attachment";

export function makeAnswerAttachment(
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityID,
) {
	return AnswerAttachment.create(
		{
			answerId: new UniqueEntityID(),
			attachmentId: new UniqueEntityID(),
			...override,
		},
		id,
	);
}
