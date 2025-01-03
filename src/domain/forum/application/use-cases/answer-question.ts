import { type Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerAttachmentsList } from "@/domain/forum/enterprise/entities/answer-attachments-list";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/awnser-attachment";

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	attachmentsIds: string[];
	content: string;
}

type AnswerQuestionUseCaseResponse = Either<
	never,
	{
		answer: Answer;
	}
>;

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		questionId,
		instructorId,
		attachmentsIds,
		content,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(instructorId),
			questionId: new UniqueEntityID(questionId),
		});

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				answerId: answer.id,
			});
		});

		answer.attachments = new AnswerAttachmentsList(answerAttachments);

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}
