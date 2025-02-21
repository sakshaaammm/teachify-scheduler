
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimeTableSettings } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [settings, setSettings] = useState<TimeTableSettings>({
    startTime: "09:00",
    endTime: "17:00",
    lectureLength: 60,
    breakTime: 10,
    lunchBreak: {
      start: "13:00",
      duration: 60,
    },
  });

  const handleSave = () => {
    localStorage.setItem("timetableSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

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
              <label>Start Time</label>
              <Input
                type="time"
                value={settings.startTime}
                onChange={(e) =>
                  setSettings({ ...settings, startTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label>End Time</label>
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
            <div className="space-y-2">
              <label>Break Time (minutes)</label>
              <Input
                type="number"
                value={settings.breakTime}
                onChange={(e) =>
                  setSettings({ ...settings, breakTime: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <label>Lunch Break Start</label>
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
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
