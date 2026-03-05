interface Props {
	readonly error: unknown;
}

const ErrorPageFallback = (props: Props) => {
	const fixedError =
		props.error instanceof Error
			? props.error
			: new Error('Something went wrong', { cause: props.error });

	if (import.meta.env.DEV) {
		return (
			<main className="flex h-screen w-screen flex-col items-center gap-y-2 overflow-y-scroll px-28 py-4">
				<h1>Application error</h1>
				<span className="text-red-500">{fixedError.message}</span>
				<details className="self-start">
					<summary>Stack trace</summary>
					<p className="text-wrap">{fixedError.stack}</p>
				</details>
			</main>
		);
	}

	return (
		<main className="relative flex h-dvh w-dvw items-center justify-center">
			<span>SOME ERROR.. AND NICE ONE O_O</span>
		</main>
	);
};

export default ErrorPageFallback;
