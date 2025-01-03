import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { makeNotification } from "@test/factories/make-notification";
import { InMemoryNotificationsRepository } from "@test/repositories/in-memory-notifications-repository";
import { beforeEach, describe, expect, it } from "vitest";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Send Notification", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to read a notification", async () => {
		const notification = makeNotification(
			{
				recipientId: new UniqueEntityID("recipient-1"),
			},
			new UniqueEntityID("notification-1"),
		);

		await inMemoryNotificationsRepository.create(notification);

		const result = await sut.execute({
			recipientId: "recipient-1",
			notificationId: "notification-1",
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryNotificationsRepository.items[0].readAt).toBeInstanceOf(
			Date,
		);
	});

	it("should not be able to read an unexistent notification", async () => {
		const notification = makeNotification(
			{
				recipientId: new UniqueEntityID("recipient-1"),
			},
			new UniqueEntityID("notification-1"),
		);

		await inMemoryNotificationsRepository.create(notification);

		const result = await sut.execute({
			recipientId: "recipient-1",
			notificationId: "notification-2",
		});

		expect(result.isRight()).toBe(false);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(inMemoryNotificationsRepository.items[0].readAt).toBe(undefined);
	});

	it("should not be able to read a notification from another user", async () => {
		const notification = makeNotification(
			{
				recipientId: new UniqueEntityID("recipient-1"),
			},
			new UniqueEntityID("notification-1"),
		);

		await inMemoryNotificationsRepository.create(notification);

		const result = await sut.execute({
			recipientId: "recipient-2",
			notificationId: "notification-1",
		});

		expect(result.isRight()).toBe(false);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryNotificationsRepository.items[0].readAt).toBe(undefined);
	});
});
