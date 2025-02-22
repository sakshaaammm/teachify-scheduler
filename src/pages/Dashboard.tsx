
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Teacher, Subject, Class } from "@/types";

const Dashboard = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const savedTeachers = localStorage.getItem("teachers");
    const savedSubjects = localStorage.getItem("subjects");
    const savedClasses = localStorage.getItem("classes");

    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedClasses) setClasses(JSON.parse(savedClasses));
  }, []);

  const stats = [
    { title: "Teachers", value: teachers.length.toString(), icon: Users },
    { title: "Subjects", value: subjects.length.toString(), icon: BookOpen },
    { title: "Classes", value: classes.length.toString(), icon: GraduationCap },
    { title: "Timetables", value: "1", icon: Calendar },
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
