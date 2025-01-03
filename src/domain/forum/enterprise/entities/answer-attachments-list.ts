import { WatchedList } from "@/core/entities/watched-list";
import type { AnswerAttachment } from "@/domain/forum/enterprise/entities/awnser-attachment";

export class AnswerAttachmentsList extends WatchedList<AnswerAttachment> {
	compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
		return a.attachmentId.equals(b.attachmentId);
	}
}
