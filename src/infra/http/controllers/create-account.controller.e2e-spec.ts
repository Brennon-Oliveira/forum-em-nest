import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create account (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	test("[POST] /accounts", async () => {
		const email = "johndoe@example.com";
		const password = "123456";
		const response = await request(app.getHttpServer()).post("/accounts").send({
			name: "John Doe",
			email,
			password,
		});

		expect(response.statusCode).toEqual(201);

		const userOnDatabase = await prisma.user.findUnique({ where: { email } });

		expect(userOnDatabase).toBeTruthy();
		expect(userOnDatabase?.password).not.toEqual(password);
	});
});
