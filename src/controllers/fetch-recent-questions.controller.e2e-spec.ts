import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { authFlow } from "test/utils/auth-flow";

describe("Create question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST] /questions", async () => {
		const { access_token } = await authFlow(app);

		type question = {
			title: string;
			content: string;
		};

		let questions: question[] = [];

		for (let i = 1; i <= 23; i++) {
			const question: question = {
				title: `Question title ${i}`,
				content: `Question content ${i}`,
			};
			await request(app.getHttpServer())
				.post("/questions")
				.set("Authorization", `Bearer ${access_token}`)
				.send(question);
			questions.push(question);
		}

		questions = questions.reverse();

		const firstPageResponse = await request(app.getHttpServer())
			.get("/questions")
			.set("Authorization", `Bearer ${access_token}`)
			.send();

		const secondPageResponse = await request(app.getHttpServer())
			.get("/questions?page=2")
			.set("Authorization", `Bearer ${access_token}`)
			.send();

		expect(firstPageResponse.statusCode).toEqual(200);
		expect(secondPageResponse.statusCode).toEqual(200);

		expect(firstPageResponse.body.questions).toHaveLength(20);
		expect(firstPageResponse.body.questions).toEqual(
			expect.arrayContaining(
				questions
					.slice(0, 19)
					.map((question) => expect.objectContaining(question)),
			),
		);

		expect(secondPageResponse.body.questions).toHaveLength(3);
		expect(secondPageResponse.body.questions).toEqual(
			expect.arrayContaining(
				questions
					.slice(20, 22)
					.map((question) => expect.objectContaining(question)),
			),
		);
	});
});
