
export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  preferredHours: number;
  preferences: {
    startTime?: string;
    endTime?: string;
    preferredSlots?: string[];
  };
}

export interface Subject {
  id: string;
  name: string;
  isLab: boolean;
  labDuration?: number;
  lecturesPerWeek: number;
}

export interface Class {
  id: string;
  name: string;
  subjects: string[];
}

export interface TimeTableSettings {
  startTime: string;
  endTime: string;
  lectureLength: number;
  shortBreaks: {
    first: {
      start: string;
      duration: number;
    };
    second: {
      start: string;
      duration: number;
    };
  };
  lunchBreak: {
    start: string;
    duration: number;
  };
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}
