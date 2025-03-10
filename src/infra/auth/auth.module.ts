import { JwtStrategy } from "@/infra/auth/jwt-strategy";
import { Env } from "@/infra/env";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			global: true,
			useFactory(config: ConfigService<Env, true>) {
				const privateKey = config.get("JWT_PRIVATE_SECRET", { infer: true });
				const publicKey = config.get("JWT_PUBLIC_SECRET", { infer: true });

				return {
					signOptions: {
						algorithm: "RS256",
					},
					privateKey: Buffer.from(privateKey, "base64"),
					publicKey: Buffer.from(publicKey, "base64"),
				};
			},
		}),
	],
	providers: [JwtStrategy],
})
export class AuthModule {}
