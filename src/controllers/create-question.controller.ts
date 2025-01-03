import { CurrentUser } from "@/auth/current-user.decorator";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { UserPayload } from "@/auth/jwt-strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { z } from "zod";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	async handle(
		@Body(new ZodValidationPipe(createQuestionBodySchema))
		body: CreateQuestionBody,
		@CurrentUser() user: UserPayload,
	) {
		const { title, content } = body;
		const userId = user.sub;

		await this.prisma.question.create({
			data: {
				authorId: userId,
				title,
				content,
				slug: this.convertToSlug(title),
			},
		});

		return "ok";
	}

	private convertToSlug(source: string): string {
		const createdSlug = source
			.normalize("NFKC")
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/_/g, "-")
			.replace(/--+/g, "-")
			.replace(/-$/, "");

		return createdSlug;
	}
}
