
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Class, Subject, Teacher, TimeTableSettings } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Generate = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [timetable, setTimetable] = useState<any[][]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
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

  useEffect(() => {
    // Load all required data from localStorage
    const savedClasses = localStorage.getItem("classes");
    const savedSubjects = localStorage.getItem("subjects");
    const savedTeachers = localStorage.getItem("teachers");
    const savedSettings = localStorage.getItem("timetableSettings");

    if (savedClasses) setClasses(JSON.parse(savedClasses));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = new Date(`2024-01-01 ${settings.startTime}`);
    const endTime = new Date(`2024-01-01 ${settings.endTime}`);

    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      slots.push(timeString);
      
      // Add lecture length
      currentTime = new Date(currentTime.getTime() + settings.lectureLength * 60000);
      
      // Add break if not end of day
      if (currentTime < endTime) {
        currentTime = new Date(currentTime.getTime() + settings.breakTime * 60000);
      }
    }
    return slots;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const timeSlots = generateTimeSlots();
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      
      // Initialize empty timetable
      const generatedTimetable = days.map(day => 
        timeSlots.map(slot => ({
          time: slot,
          day: day,
          subject: "Free",
          teacher: "-"
        }))
      );

      setTimetable(generatedTimetable);
      toast.success("Timetable generated successfully!");
    } catch (error) {
      toast.error("Error generating timetable");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      const element = document.getElementById('timetable');
      if (!element) {
        toast.error("No timetable to export");
        return;
      }

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('timetable.pdf');
      
      toast.success("Timetable exported to PDF!");
    } catch (error) {
      toast.error("Error exporting timetable");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold animate-float">Generate Timetable</h1>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Generate Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full animate-glow" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Timetable"}
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleExport}
            disabled={timetable.length === 0}
          >
            <Download className="mr-2" />
            Export to PDF
          </Button>
        </CardContent>
      </Card>

      {timetable.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Generated Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="timetable" className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 p-2">Time / Day</th>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                      <th key={day} className="border border-gray-200 p-2">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generateTimeSlots().map((timeSlot, rowIndex) => (
                    <tr key={timeSlot}>
                      <td className="border border-gray-200 p-2">{timeSlot}</td>
                      {timetable.map((day, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`} className="border border-gray-200 p-2">
                          {day[rowIndex]?.subject}
                          <br />
                          <small>{day[rowIndex]?.teacher}</small>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Generate;
