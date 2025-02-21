
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Calendar } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "Teachers", value: "12", icon: Users },
    { title: "Subjects", value: "24", icon: BookOpen },
    { title: "Classes", value: "8", icon: GraduationCap },
    { title: "Timetables", value: "4", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold animate-float">Welcome to TimeTable Pro</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass-card animate-float">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
