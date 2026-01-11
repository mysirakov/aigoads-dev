import { DashboardLayout } from "@/components/DashboardLayout";
import { Hero } from "@/components/Hero";
import { RecentProjects } from "@/components/RecentProjects";

export default function Home() {
  return (
    <DashboardLayout>
      <Hero />
      <RecentProjects />
    </DashboardLayout>
  );
}
