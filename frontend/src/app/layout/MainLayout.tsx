import NavigationMenu from "@/features/common/components/NavigationMenu";
import { Outlet } from "react-router";


export default function MainLayout() {
  return (
    <div className="flex flex-col gap-2 min-h-screen">
      <NavigationMenu />
      <Outlet />
    </div>
  )
}
