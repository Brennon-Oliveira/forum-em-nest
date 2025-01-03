import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { QuestionAttachmentsList } from "@/domain/forum/enterprise/entities/question-attachments-list";

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		content,
		attachmentsIds,
		title,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (question.authorId.toValue() !== authorId) {
			return left(new NotAllowedError());
		}

		const currentQuestionAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

		const questionAttachmentList = new QuestionAttachmentsList(
			currentQuestionAttachments,
		);

		const questionAttachments = attachmentsIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				questionId: question.id,
			});
		});

		questionAttachmentList.update(questionAttachments);

		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentList;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}
