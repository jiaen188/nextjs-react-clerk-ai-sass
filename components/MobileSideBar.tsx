"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";

const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="ghost" size="icon">
          <Menu></Menu>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar></Sidebar>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideBar;
