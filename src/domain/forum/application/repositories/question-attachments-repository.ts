import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export interface QuestionAttachmentsRepository {
	findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
	deleteManyByQuestionId(questionId: string): Promise<void>;
}
