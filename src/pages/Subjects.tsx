import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Subject } from "@/types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
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

const Subjects = () => {
  const queryClient = useQueryClient();
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: "",
    isLab: false,
    labDuration: 2,
    lecturesPerWeek: 1,
  });
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Fetch subjects
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return data.map(subject => ({
        id: subject.id,
        name: subject.name,
        isLab: subject.is_lab,
        labDuration: subject.lab_duration,
        lecturesPerWeek: subject.lectures_per_week
      }));
    }
  });

  // Add subject mutation
  const addSubjectMutation = useMutation({
    mutationFn: async (subject: Partial<Subject>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('subjects')
        .insert([{
          name: subject.name,
          is_lab: subject.isLab,
          lab_duration: subject.isLab ? subject.labDuration : null,
          lectures_per_week: subject.lecturesPerWeek,
          user_id: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setNewSubject({
        name: "",
        isLab: false,
        labDuration: 2,
        lecturesPerWeek: 1,
      });
      toast.success("Subject added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  // Delete subject mutation
  const deleteSubjectMutation = useMutation({
    mutationFn: async (subject: Subject) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subject.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success("Subject deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast.error("Please enter subject name");
      return;
    }

    addSubjectMutation.mutate(newSubject);
  };

  const handleDelete = (subject: Subject) => {
    if (window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
      deleteSubjectMutation.mutate(subject);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

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
          <Button 
            onClick={handleAddSubject} 
            className="w-full"
            disabled={addSubjectMutation.isPending}
          >
            {addSubjectMutation.isPending ? "Adding..." : "Add Subject"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card 
            key={subject.id} 
            className="glass-card animate-float cursor-pointer relative group"
            onClick={() => setSelectedSubject(subject)}
          >
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(subject);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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

      <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSubject?.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-2">
                <p>Type: {selectedSubject?.isLab ? "Lab" : "Theory"}</p>
                {selectedSubject?.isLab && (
                  <p>Lab Duration: {selectedSubject.labDuration} hours</p>
                )}
                <p>Lectures per week: {selectedSubject?.lecturesPerWeek}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
