import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { z } from "zod";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	async handle(
		@Query("page", new ZodValidationPipe(pageQueryParamSchema))
		page: PageQueryParam,
	) {
		const perPage = 20;

		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: perPage,
			skip: (page - 1) * perPage,
		});

		return {
			questions,
		};
	}
}
