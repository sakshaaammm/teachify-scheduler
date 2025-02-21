
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Teacher } from "@/types";
import { toast } from "sonner";

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    subjects: [],
    preferredHours: 0,
  });

  const handleAddTeacher = () => {
    if (!newTeacher.name) {
      toast.error("Please enter teacher name");
      return;
    }

    const teacher: Teacher = {
      id: Date.now().toString(),
      name: newTeacher.name,
      subjects: newTeacher.subjects || [],
      preferredHours: newTeacher.preferredHours || 0,
      preferences: {},
    };

    setTeachers([...teachers, teacher]);
    setNewTeacher({ name: "", subjects: [], preferredHours: 0 });
    toast.success("Teacher added successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold animate-float">Teachers</h1>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Add New Teacher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Teacher Name"
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAddTeacher} className="w-full">
            Add Teacher
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="glass-card animate-float">
            <CardHeader>
              <CardTitle>{teacher.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Preferred Hours: {teacher.preferredHours}</p>
              <p>Subjects: {teacher.subjects.join(", ") || "None assigned"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
