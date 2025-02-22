
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Class, Subject } from "@/types";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    subjects: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedClasses = localStorage.getItem("classes");
    const savedSubjects = localStorage.getItem("subjects");
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
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
                  {newClass.subjects?.length
                    ? `${newClass.subjects.length} subjects selected`
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
                          const isSelected = newClass.subjects?.includes(subject.name);
                          const updatedSubjects = isSelected
                            ? newClass.subjects?.filter((s) => s !== subject.name)
                            : [...(newClass.subjects || []), subject.name];
                          setNewClass({
                            ...newClass,
                            subjects: updatedSubjects,
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            newClass.subjects?.includes(subject.name)
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
