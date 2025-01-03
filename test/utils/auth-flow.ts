import { INestApplication } from "@nestjs/common";
import request from "supertest";

export async function authFlow(app: INestApplication) {
	const email = "johndoe@example.com";
	const password = "123456";
	const name = "John Doe";
	await request(app.getHttpServer()).post("/accounts").send({
		name,
		email,
		password,
	});

	const { body } = await request(app.getHttpServer()).post("/sessions").send({
		email,
		password,
	});

	const {
		access_token,
	}: {
		access_token: string;
	} = body;

	return {
		name,
		email,
		password,
		access_token,
	};
}
