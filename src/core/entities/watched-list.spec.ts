import { WatchedList } from "@/core/entities/watched-list";
import { describe, expect, it } from "vitest";

class NumberWatchedList extends WatchedList<number> {
	compareItems(a: number, b: number): boolean {
		return a === b;
	}
}

describe("Watched List", () => {
	it("should be able to create a watche list with inital items", () => {
		const list = new NumberWatchedList([1, 2, 3]);

		expect(list.items).toHaveLength(3);
		expect(list.items).toEqual([1, 2, 3]);
	});

	it("should be able to add new items to the list", () => {
		const list = new NumberWatchedList([1, 2, 3]);

		list.add(4);

		expect(list.items).toHaveLength(4);
		expect(list.items).toEqual(expect.arrayContaining([1, 2, 3, 4]));
		expect(list.newItems).toHaveLength(1);
		expect(list.newItems).toEqual(expect.arrayContaining([4]));
	});

	it("should be able to remove items from the list", () => {
		const list = new NumberWatchedList([1, 2, 3]);

		list.remove(2);

		expect(list.items).toHaveLength(2);
		expect(list.items).toEqual(expect.arrayContaining([1, 3]));
		expect(list.removedItems).toHaveLength(1);
		expect(list.removedItems).toEqual(expect.arrayContaining([2]));
	});

	it("should be able to add an item even if it was removed before", () => {
		const list = new NumberWatchedList([1, 2, 3]);

		list.remove(2);

		list.add(2);

		expect(list.items).toHaveLength(3);
		expect(list.items).toEqual(expect.arrayContaining([1, 2, 3]));
		expect(list.removedItems).toEqual([]);
		expect(list.newItems).toEqual([]);
	});

	it("should be able to remove an item even if it was added before", () => {
		const list = new NumberWatchedList([1, 2, 3]);

		list.add(4);

		list.remove(4);

		expect(list.items).toHaveLength(3);
		expect(list.items).toEqual(expect.arrayContaining([1, 2, 3]));
		expect(list.removedItems).toEqual([]);
		expect(list.newItems).toEqual([]);
	});

	it("should be able to updated watched list items", () => {
		const list = new NumberWatchedList([1, 2, 3, 4]);

		list.update([1, 3, 5, 7]);

		expect(list.removedItems).toHaveLength(2);
		expect(list.removedItems).toEqual(expect.arrayContaining([2, 4]));
		expect(list.newItems).toHaveLength(2);
		expect(list.newItems).toEqual(expect.arrayContaining([5, 7]));
		expect(list.items).toHaveLength(4);
		expect(list.items).toEqual(expect.arrayContaining([1, 3, 5, 7]));
	});
});
