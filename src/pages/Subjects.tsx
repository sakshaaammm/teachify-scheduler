
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Subject } from "@/types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: "",
    isLab: false,
    labDuration: 2,
    lecturesPerWeek: 1,
  });

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast.error("Please enter subject name");
      return;
    }

    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      isLab: newSubject.isLab || false,
      labDuration: newSubject.isLab ? newSubject.labDuration : undefined,
      lecturesPerWeek: newSubject.lecturesPerWeek || 1,
    };

    setSubjects([...subjects, subject]);
    setNewSubject({
      name: "",
      isLab: false,
      labDuration: 2,
      lecturesPerWeek: 1,
    });
    toast.success("Subject added successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold animate-float">Subjects</h1>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Add New Subject</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={newSubject.isLab}
              onCheckedChange={(checked) =>
                setNewSubject({ ...newSubject, isLab: checked })
              }
            />
            <span>Is Lab?</span>
          </div>
          {newSubject.isLab && (
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Lab Duration (hours)"
                value={newSubject.labDuration}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    labDuration: parseInt(e.target.value),
                  })
                }
                min={2}
                max={4}
              />
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Lectures Per Week"
              value={newSubject.lecturesPerWeek}
              onChange={(e) =>
                setNewSubject({
                  ...newSubject,
                  lecturesPerWeek: parseInt(e.target.value),
                })
              }
              min={1}
            />
          </div>
          <Button onClick={handleAddSubject} className="w-full">
            Add Subject
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="glass-card animate-float">
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {subject.isLab ? "Lab" : "Theory"}</p>
              {subject.isLab && <p>Lab Duration: {subject.labDuration} hours</p>}
              <p>Lectures per week: {subject.lecturesPerWeek}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
