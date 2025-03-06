
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "./ui/card";

const data = [
  { month: "Jan", engagement: 65 },
  { month: "Feb", engagement: 72 },
  { month: "Mar", engagement: 85 },
  { month: "Apr", engagement: 78 },
  { month: "May", engagement: 90 },
  { month: "Jun", engagement: 95 },
];

export const ContentChart = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Content Performance</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#engagement)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
