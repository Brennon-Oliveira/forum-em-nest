import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export interface QuestionsRepository {
	create(question: Question): Promise<void>;
	findById(id: string): Promise<Question | null>;
	delete(question: Question): Promise<void>;
	save(question: Question): Promise<void>;
	findBySlug(slug: string): Promise<Question | null>;
	findManyRecent(params: PaginationParams): Promise<Question[]>;
}