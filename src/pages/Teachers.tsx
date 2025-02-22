
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Teacher, Subject } from "@/types";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    subjects: [],
    preferredHours: 0,
    preferences: {
      startTime: "",
      endTime: "",
      preferredSlots: [],
    },
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedTeachers = localStorage.getItem("teachers");
    const savedSubjects = localStorage.getItem("subjects");
    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    }
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

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
      preferences: {
        startTime: newTeacher.preferences?.startTime || "",
        endTime: newTeacher.preferences?.endTime || "",
        preferredSlots: newTeacher.preferences?.preferredSlots || [],
      },
    };

    const updatedTeachers = [...teachers, teacher];
    setTeachers(updatedTeachers);
    localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
    setNewTeacher({
      name: "",
      subjects: [],
      preferredHours: 0,
      preferences: {
        startTime: "",
        endTime: "",
        preferredSlots: [],
      },
    });
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
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Preferred Hours per Week"
              value={newTeacher.preferredHours}
              onChange={(e) =>
                setNewTeacher({
                  ...newTeacher,
                  preferredHours: parseInt(e.target.value),
                })
              }
              min={0}
              max={40}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Preferred Start Time</label>
              <Input
                type="time"
                value={newTeacher.preferences?.startTime}
                onChange={(e) =>
                  setNewTeacher({
                    ...newTeacher,
                    preferences: {
                      ...newTeacher.preferences,
                      startTime: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label>Preferred End Time</label>
              <Input
                type="time"
                value={newTeacher.preferences?.endTime}
                onChange={(e) =>
                  setNewTeacher({
                    ...newTeacher,
                    preferences: {
                      ...newTeacher.preferences,
                      endTime: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label>Subjects</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {newTeacher.subjects?.length
                    ? `${newTeacher.subjects.length} subjects selected`
                    : "Select subjects..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search subjects..." />
                  <CommandEmpty>No subject found.</CommandEmpty>
                  <CommandGroup>
                    {subjects.map((subject) => (
                      <CommandItem
                        key={subject.id}
                        onSelect={() => {
                          const isSelected = newTeacher.subjects?.includes(subject.name);
                          const updatedSubjects = isSelected
                            ? newTeacher.subjects?.filter((s) => s !== subject.name)
                            : [...(newTeacher.subjects || []), subject.name];
                          setNewTeacher({
                            ...newTeacher,
                            subjects: updatedSubjects,
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            newTeacher.subjects?.includes(subject.name)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {subject.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
              <p>Weekly Hours: {teacher.preferredHours}</p>
              <p>Start Time: {teacher.preferences.startTime || "Flexible"}</p>
              <p>End Time: {teacher.preferences.endTime || "Flexible"}</p>
              <p>Subjects: {teacher.subjects.join(", ") || "None assigned"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
