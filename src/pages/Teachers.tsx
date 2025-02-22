
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Teacher } from "@/types";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Teachers = () => {
  const queryClient = useQueryClient();
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

  // Fetch teachers
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('teachers')
        .select('*, teacher_subjects(subject_name)')
        .order('created_at', { ascending: true });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return data.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        preferredHours: teacher.preferred_hours,
        subjects: teacher.teacher_subjects.map(ts => ts.subject_name),
        preferences: {
          startTime: teacher.preferred_start_time,
          endTime: teacher.preferred_end_time,
          preferredSlots: [],
        },
      }));
    }
  });

  // Fetch subjects for selection
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('subjects')
        .select('name')
        .order('name', { ascending: true });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return data.map(subject => subject.name);
    }
  });

  // Add teacher mutation
  const addTeacherMutation = useMutation({
    mutationFn: async (teacher: Partial<Teacher>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // First insert the teacher
      const { data: newTeacher, error: teacherError } = await supabase
        .from('teachers')
        .insert([{
          name: teacher.name,
          preferred_hours: teacher.preferredHours,
          preferred_start_time: teacher.preferences?.startTime,
          preferred_end_time: teacher.preferences?.endTime,
          user_id: user.user.id
        }])
        .select()
        .single();

      if (teacherError) throw teacherError;

      // Then insert the teacher-subject relationships
      if (teacher.subjects && teacher.subjects.length > 0) {
        const { error: subjectsError } = await supabase
          .from('teacher_subjects')
          .insert(
            teacher.subjects.map(subject => ({
              teacher_id: newTeacher.id,
              subject_name: subject,
              user_id: user.user.id
            }))
          );

        if (subjectsError) throw subjectsError;
      }

      return newTeacher;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
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
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleAddTeacher = () => {
    if (!newTeacher.name) {
      toast.error("Please enter teacher name");
      return;
    }

    addTeacherMutation.mutate(newTeacher);
  };

  if (teachersLoading || subjectsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

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
                        key={subject}
                        onSelect={() => {
                          const isSelected = newTeacher.subjects?.includes(subject);
                          const updatedSubjects = isSelected
                            ? newTeacher.subjects?.filter((s) => s !== subject)
                            : [...(newTeacher.subjects || []), subject];
                          setNewTeacher({
                            ...newTeacher,
                            subjects: updatedSubjects,
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            newTeacher.subjects?.includes(subject)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {subject}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button 
            onClick={handleAddTeacher} 
            className="w-full"
            disabled={addTeacherMutation.isPending}
          >
            {addTeacherMutation.isPending ? "Adding..." : "Add Teacher"}
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
