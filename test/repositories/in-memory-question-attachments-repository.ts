import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = [];

	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const questionAttachment = this.items.filter(
			(questionAttachment) =>
				questionAttachment.questionId.toString() === questionId,
		);

		return questionAttachment;
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		);

		this.items = questionAttachments;
	}
}
