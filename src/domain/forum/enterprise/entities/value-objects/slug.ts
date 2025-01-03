export class Slug {
	value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static create(slug: string) {
		return new Slug(slug);
	}

	static createSlugFromText(text: string) {
		const createdSlug = text
			.normalize("NFKC")
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/_/g, "-")
			.replace(/--+/g, "-")
			.replace(/-$/, "");

		return new Slug(createdSlug);
	}
}
