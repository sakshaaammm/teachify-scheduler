
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Generate = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Here we'll add the timetable generation logic later
    toast.success("Timetable generated successfully!");
    setIsGenerating(false);
  };

  const handleExport = () => {
    // Here we'll add PDF export logic later
    toast.success("Timetable exported to PDF!");
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
          >
            <Download className="mr-2" />
            Export to PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Generate;
