import { UserButton } from "@clerk/nextjs";
import MobileSideBar from "@/components/MobileSideBar";

const Navbar = async ({ apiLimitCount = 0 }) => {
  return (
    <div className="flex items-center p-4">
      <MobileSideBar apiLimitCount={apiLimitCount}></MobileSideBar>
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/"></UserButton>
      </div>
    </div>
  );
};

export default Navbar;
