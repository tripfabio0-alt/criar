import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/app/consultoria/senior/$cliente')({
  component: () => <Outlet />,
});
