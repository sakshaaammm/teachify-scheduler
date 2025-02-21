
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Class } from "@/types";
import { toast } from "sonner";

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    subjects: [],
  });

  useEffect(() => {
    const savedClasses = localStorage.getItem("classes");
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

  const handleAddClass = () => {
    if (!newClass.name) {
      toast.error("Please enter class name");
      return;
    }

    const classItem: Class = {
      id: Date.now().toString(),
      name: newClass.name,
      subjects: newClass.subjects || [],
    };

    const updatedClasses = [...classes, classItem];
    setClasses(updatedClasses);
    localStorage.setItem("classes", JSON.stringify(updatedClasses));
    setNewClass({ name: "", subjects: [] });
    toast.success("Class added successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold animate-float">Classes</h1>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Add New Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Class Name"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
            />
          </div>
          <Button onClick={handleAddClass} className="w-full">
            Add Class
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="glass-card animate-float">
            <CardHeader>
              <CardTitle>{classItem.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Subjects: {classItem.subjects.join(", ") || "None assigned"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Classes;
