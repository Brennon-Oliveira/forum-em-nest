export class Left<L, R> {
	readonly value: L;
	readonly _type = "Left" as const;

	constructor(value: L) {
		this.value = value;
	}

	isRight(): this is Right<L, R> {
		return false;
	}

	isLeft(): this is Left<L, R> {
		return true;
	}
}

export class Right<L, R> {
	readonly value: R;
	readonly _type = "Right" as const;

	constructor(value: R) {
		this.value = value;
	}

	isRight(): this is Right<L, R> {
		return true;
	}

	isLeft(): this is Right<L, R> {
		return false;
	}
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

export const left = <L, R>(value: L): Either<L, R> => {
	return new Left(value);
};

export const right = <L, R>(value: R): Either<L, R> => {
	return new Right(value);
};
