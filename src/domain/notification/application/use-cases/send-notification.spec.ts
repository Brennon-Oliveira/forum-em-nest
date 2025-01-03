import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { InMemoryNotificationsRepository } from "@test/repositories/in-memory-notifications-repository";
import { beforeEach, describe, expect, it } from "vitest";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send Notification", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to create a notification", async () => {
		const result = await sut.execute({
			title: "Nova notificação",
			content: "Conteúdo da notificação",
			recipientId: "recipient-1",
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryNotificationsRepository.items[0]).toEqual(
			result.value.notification,
		);
	});
});
