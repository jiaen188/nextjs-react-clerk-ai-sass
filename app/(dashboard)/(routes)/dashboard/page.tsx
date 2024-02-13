import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
  return (
    <div>
      dashboard page(protected)
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default DashboardPage;
