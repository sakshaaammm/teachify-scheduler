
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimeTableSettings } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";

const defaultSettings: TimeTableSettings = {
  startTime: "09:00",
  endTime: "17:00",
  lectureLength: 60,
  shortBreaks: {
    first: {
      start: "10:30",
      duration: 10,
    },
    second: {
      start: "14:30",
      duration: 10,
    }
  },
  lunchBreak: {
    start: "13:00",
    duration: 60,
  },
};

const Settings = () => {
  const [settings, setSettings] = useState<TimeTableSettings>(defaultSettings);

  // Fetch settings
  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('timetable_settings')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data) {
        return {
          startTime: data.start_time,
          endTime: data.end_time,
          lectureLength: data.lecture_length,
          shortBreaks: {
            first: {
              start: data.first_break_start,
              duration: data.first_break_duration,
            },
            second: {
              start: data.second_break_start,
              duration: data.second_break_duration,
            }
          },
          lunchBreak: {
            start: data.lunch_break_start,
            duration: data.lunch_break_duration,
          },
        };
      }

      return defaultSettings;
    },
    onSuccess: (data) => {
      setSettings(data);
    }
  });

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (settings: TimeTableSettings) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('timetable_settings')
        .upsert({
          user_id: user.user.id,
          start_time: settings.startTime,
          end_time: settings.endTime,
          lecture_length: settings.lectureLength,
          first_break_start: settings.shortBreaks.first.start,
          first_break_duration: settings.shortBreaks.first.duration,
          second_break_start: settings.shortBreaks.second.start,
          second_break_duration: settings.shortBreaks.second.duration,
          lunch_break_start: settings.lunchBreak.start,
          lunch_break_duration: settings.lunchBreak.duration,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
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
      <h1 className="text-3xl font-bold animate-float">Settings</h1>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>TimeTable Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>School Start Time</label>
              <Input
                type="time"
                value={settings.startTime}
                onChange={(e) =>
                  setSettings({ ...settings, startTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label>School End Time</label>
              <Input
                type="time"
                value={settings.endTime}
                onChange={(e) =>
                  setSettings({ ...settings, endTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label>Lecture Length (minutes)</label>
              <Input
                type="number"
                value={settings.lectureLength}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    lectureLength: parseInt(e.target.value),
                  })
                }
              />
            </div>

            {/* First Short Break */}
            <div className="space-y-2">
              <label>First Break Start Time</label>
              <Input
                type="time"
                value={settings.shortBreaks.first.start}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shortBreaks: {
                      ...settings.shortBreaks,
                      first: {
                        ...settings.shortBreaks.first,
                        start: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label>First Break Duration (minutes)</label>
              <Input
                type="number"
                value={settings.shortBreaks.first.duration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shortBreaks: {
                      ...settings.shortBreaks,
                      first: {
                        ...settings.shortBreaks.first,
                        duration: parseInt(e.target.value),
                      },
                    },
                  })
                }
                min={10}
                max={15}
              />
            </div>

            {/* Second Short Break */}
            <div className="space-y-2">
              <label>Second Break Start Time</label>
              <Input
                type="time"
                value={settings.shortBreaks.second.start}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shortBreaks: {
                      ...settings.shortBreaks,
                      second: {
                        ...settings.shortBreaks.second,
                        start: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label>Second Break Duration (minutes)</label>
              <Input
                type="number"
                value={settings.shortBreaks.second.duration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shortBreaks: {
                      ...settings.shortBreaks,
                      second: {
                        ...settings.shortBreaks.second,
                        duration: parseInt(e.target.value),
                      },
                    },
                  })
                }
                min={10}
                max={15}
              />
            </div>

            {/* Lunch Break */}
            <div className="space-y-2">
              <label>Lunch Break Start Time</label>
              <Input
                type="time"
                value={settings.lunchBreak.start}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    lunchBreak: { ...settings.lunchBreak, start: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label>Lunch Break Duration (minutes)</label>
              <Input
                type="number"
                value={settings.lunchBreak.duration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    lunchBreak: {
                      ...settings.lunchBreak,
                      duration: parseInt(e.target.value),
                    },
                  })
                }
                min={30}
                max={60}
              />
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
