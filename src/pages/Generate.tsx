
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Generate = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold animate-float">Generate Timetable</h1>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Generate Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full animate-glow">
            Generate Timetable
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Generate;
