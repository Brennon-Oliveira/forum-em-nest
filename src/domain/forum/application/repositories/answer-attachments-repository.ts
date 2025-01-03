import type { AnswerAttachment } from "@/domain/forum/enterprise/entities/awnser-attachment";

export interface AnswerAttachmentsRepository {
	findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
	deleteManyByAnswerId(answerId: string): Promise<void>;
}
