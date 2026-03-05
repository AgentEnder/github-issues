import { Outlet } from '@tanstack/react-router';

const AuthorizedLayout = () => {
	return (
		<main className="h-screen w-full">
			<span>LAYOUT</span>

			<Outlet />
		</main>
	);
};

export default AuthorizedLayout;
