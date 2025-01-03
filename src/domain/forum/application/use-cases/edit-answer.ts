import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerAttachmentsList } from "@/domain/forum/enterprise/entities/answer-attachments-list";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/awnser-attachment";

interface EditAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
	attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer;
	}
>;

export class EditAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
		attachmentsIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (answer.authorId.toValue() !== authorId) {
			return left(new NotAllowedError());
		}

		const currentAnswerAttachments =
			await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

		const answerAttachmentList = new AnswerAttachmentsList(
			currentAnswerAttachments,
		);

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				answerId: answer.id,
			});
		});

		answerAttachmentList.update(answerAttachments);

		answer.attachments = answerAttachmentList;

		answer.content = content;

		await this.answersRepository.save(answer);

		return right({ answer });
	}
}
