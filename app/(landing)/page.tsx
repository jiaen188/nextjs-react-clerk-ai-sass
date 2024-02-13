import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const LandingPage = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      landing page (unprotected route)
      <Button variant="destructive">Click</Button>;
    </div>
  );
};

export default LandingPage;
