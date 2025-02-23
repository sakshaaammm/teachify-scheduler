
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Class } from "@/types";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Classes = () => {
  const queryClient = useQueryClient();
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    subjects: [],
  });
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('classes')
        .select('*, class_subjects(subject_name)')
        .order('created_at', { ascending: true });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return (data || []).map(classItem => ({
        id: classItem.id,
        name: classItem.name,
        subjects: (classItem.class_subjects || []).map(cs => cs.subject_name)
      }));
    },
    enabled: !!supabase.auth.getSession()
  });

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

      return data?.map(subject => subject.name) || [];
    },
    enabled: !!supabase.auth.getSession()
  });

  const addClassMutation = useMutation({
    mutationFn: async (classData: Partial<Class>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // First insert the class
      const { data: newClass, error: classError } = await supabase
        .from('classes')
        .insert([{
          name: classData.name,
          user_id: user.user.id
        }])
        .select()
        .single();

      if (classError) throw classError;

      // Then insert the class-subject relationships if there are any subjects
      if (classData.subjects && classData.subjects.length > 0) {
        const { error: subjectsError } = await supabase
          .from('class_subjects')
          .insert(
            classData.subjects.map(subject => ({
              class_id: newClass.id,
              subject_name: subject,
              user_id: user.user.id
            }))
          );

        if (subjectsError) {
          // If adding subjects fails, delete the class to maintain consistency
          await supabase.from('classes').delete().eq('id', newClass.id);
          throw subjectsError;
        }
      }

      return newClass;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setNewClass({ name: "", subjects: [] });
      setOpen(false);
      toast.success("Class added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (classItem: Class) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classItem.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success("Class deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleAddClass = () => {
    if (!newClass.name) {
      toast.error("Please enter class name");
      return;
    }

    addClassMutation.mutate(newClass);
  };

  const handleDelete = (classItem: Class) => {
    if (window.confirm(`Are you sure you want to delete ${classItem.name}?`)) {
      deleteClassMutation.mutate(classItem);
    }
  };

  if (classesLoading || subjectsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

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
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search subjects..." />
                  <CommandEmpty>No subject found.</CommandEmpty>
                  <CommandGroup>
                    {(subjects || []).map((subject) => (
                      <CommandItem
                        key={subject}
                        value={subject}
                        onSelect={() => {
                          const isSelected = newClass.subjects?.includes(subject);
                          const updatedSubjects = isSelected
                            ? newClass.subjects?.filter((s) => s !== subject)
                            : [...(newClass.subjects || []), subject];
                          setNewClass({
                            ...newClass,
                            subjects: updatedSubjects,
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            newClass.subjects?.includes(subject)
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
            onClick={handleAddClass} 
            className="w-full"
            disabled={addClassMutation.isPending}
          >
            {addClassMutation.isPending ? "Adding..." : "Add Class"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card 
            key={classItem.id} 
            className="glass-card animate-float cursor-pointer relative group"
            onClick={() => setSelectedClass(classItem)}
          >
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(classItem);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader>
              <CardTitle>{classItem.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Subjects: {classItem.subjects?.join(", ") || "None assigned"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass?.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Assigned Subjects:</h3>
                {selectedClass?.subjects?.length ? (
                  <ul className="list-disc pl-4">
                    {selectedClass.subjects.map((subject, index) => (
                      <li key={index}>{subject}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No subjects assigned</p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
