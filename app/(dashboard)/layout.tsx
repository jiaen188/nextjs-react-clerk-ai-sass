import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getApiLimitCount } from "@/lib/api-limit";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // neon 链接不能开代理，所以用trycatch ，不然本地开发报错，页面一片空白
  let apiLimitCount = 0;
  try {
    apiLimitCount = await getApiLimitCount();
  } catch (error) {
    console.log("error", error);
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar apiLimitCount={apiLimitCount}></Sidebar>
      </div>
      <main className="md:pl-72">
        <Navbar apiLimitCount={apiLimitCount}></Navbar>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
