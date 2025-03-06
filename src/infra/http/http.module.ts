import { DatabaseModule } from "@/infra/database/database.module";
import { AuthenticateController } from "@/infra/http/controllers/authenticate.controller";
import { CreateAccountController } from "@/infra/http/controllers/create-account.controller";
import { CreateQuestionController } from "@/infra/http/controllers/create-question.controller";
import { FetchRecentQuestionsController } from "@/infra/http/controllers/fetch-recent-questions.controller";
import { Module } from "@nestjs/common";

@Module({
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		FetchRecentQuestionsController,
	],
	imports: [DatabaseModule],
	providers: [],
})
export class HttpModule {}
