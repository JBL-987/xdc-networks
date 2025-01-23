import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
type Variant = "yellow" | "green" | "red";

interface DashboardStatsProps {
  status: string;
  count: number;
  icon: LucideIcon;
  variant: Variant;
}

const DashboardStats = ({ status, count, icon:Icon, variant }: DashboardStatsProps) => {
  const colorClasses: Record<string, string> = {
    yellow: "text-yellow-300",
    green: "text-green-500",
    red: "text-red-500",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{status}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <Icon className={`h-8 w-8 ${colorClasses[variant]} !important`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
