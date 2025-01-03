import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswerAttachment } from "@/domain/forum/enterprise/entities/awnser-attachment";

export class InMemoryAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
{
	public items: AnswerAttachment[] = [];

	async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const answerAttachment = this.items.filter(
			(answerAttachment) => answerAttachment.answerId.toString() === answerId,
		);

		return answerAttachment;
	}

	async deleteManyByAnswerId(answerId: string): Promise<void> {
		const answerAttachments = this.items.filter(
			(item) => item.answerId.toString() !== answerId,
		);

		this.items = answerAttachments;
	}
}
