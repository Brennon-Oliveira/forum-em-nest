import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
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

		const title = "New question";
		const content = "Question content";
		const response = await request(app.getHttpServer())
			.post("/questions")
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				title,
				content,
			});

		expect(response.statusCode).toEqual(201);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title,
			},
		});

		expect(questionOnDatabase).toBeTruthy();
		expect(questionOnDatabase?.content).toEqual(content);
	});
});
