import { Exam } from "@/types/exam";

export interface LockInModeState {
  isActive: boolean;
  examId: string;
  courseCode: string;
  examName: string;
  startTime: number;
  totalDuration: number;
  pausedAt?: number;
  totalPausedTime: number;
  sessionId: string;
  lastActivity: number;
}

export interface LockInModeSession {
  sessionId: string;
  examId: string;
  courseCode: string;
  examName: string;
  startTime: number;
  endTime?: number;
  totalDuration: number;
  timeUsed: number;
  completed: boolean;
  expired: boolean;
  reason?: string;
}

const EXAM_MODE_KEY = "examMode";
const EXAM_HISTORY_KEY = "examHistory";
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

export class LockInModeManager {
  static initializeExamMode(): LockInModeState | null {
    const currentSession = this.getCurrentSession();

    if (currentSession) {
      if (this.isSessionStale(currentSession)) {
        this.cleanupStaleSession(currentSession);
        return null;
      }

      if (this.isTimeExpired(currentSession)) {
        this.handleExpiredSession(currentSession);
        return null;
      }

      return currentSession;
    }

    return null;
  }

  static startExamSession(
    exam: Exam,
    durationMinutes: number,
  ): LockInModeState {
    const existing = this.getCurrentSession();
    if (existing) {
      this.forceEndSession(existing, "replaced");
    }

    const session: LockInModeState = {
      isActive: true,
      examId: exam.id.toString(),
      courseCode: exam.course_code,
      examName: exam.exam_name,
      startTime: Date.now(),
      totalDuration: durationMinutes * 60 * 1000,
      totalPausedTime: 0,
      sessionId: crypto.randomUUID(),
      lastActivity: Date.now(),
    };

    localStorage.setItem(EXAM_MODE_KEY, JSON.stringify(session));
    return session;
  }

  static getCurrentSession(): LockInModeState | null {
    try {
      const stored = localStorage.getItem(EXAM_MODE_KEY);

      if (!stored) {
        return null;
      }

      const session = JSON.parse(stored);

      if (!this.isValidSession(session)) {
        localStorage.removeItem(EXAM_MODE_KEY);
        return null;
      }

      return session;
    } catch (error) {
      localStorage.removeItem(EXAM_MODE_KEY);
      return null;
    }
  }

  static updateActivity(): void {
    const session = this.getCurrentSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem(EXAM_MODE_KEY, JSON.stringify(session));
    }
  }

  static pauseSession(): void {
    const session = this.getCurrentSession();
    if (session && !session.pausedAt) {
      session.pausedAt = Date.now();
      session.lastActivity = Date.now();
      localStorage.setItem(EXAM_MODE_KEY, JSON.stringify(session));
    }
  }

  static resumeSession(): void {
    const session = this.getCurrentSession();
    if (session && session.pausedAt) {
      session.totalPausedTime += Date.now() - session.pausedAt;
      delete session.pausedAt;
      session.lastActivity = Date.now();
      localStorage.setItem(EXAM_MODE_KEY, JSON.stringify(session));
    }
  }

  static getTimeRemaining(): number {
    const session = this.getCurrentSession();
    if (!session) return 0;

    const now = Date.now();
    let elapsed = now - session.startTime - session.totalPausedTime;

    if (session.pausedAt) {
      elapsed -= now - session.pausedAt;
    }

    return Math.max(0, session.totalDuration - elapsed);
  }

  static isTimeExpired(session?: LockInModeState): boolean {
    const currentSession = session || this.getCurrentSession();
    if (!currentSession) return false;
    return this.getTimeRemaining() <= 0;
  }

  static isSessionStale(session: LockInModeState): boolean {
    return Date.now() - session.lastActivity > SESSION_TIMEOUT;
  }

  static isValidSession(session: any): boolean {
    return (
      session &&
      typeof session.isActive === "boolean" &&
      typeof session.examId === "string" &&
      typeof session.startTime === "number" &&
      typeof session.totalDuration === "number" &&
      typeof session.sessionId === "string" &&
      typeof session.lastActivity === "number"
    );
  }

  static completeSession(): void {
    const session = this.getCurrentSession();
    if (!session) return;

    const timeUsed = session.totalDuration - this.getTimeRemaining();

    this.addToHistory({
      sessionId: session.sessionId,
      examId: session.examId,
      courseCode: session.courseCode,
      examName: session.examName,
      startTime: session.startTime,
      endTime: Date.now(),
      totalDuration: session.totalDuration,
      timeUsed,
      completed: true,
      expired: false,
      reason: "completed",
    });

    localStorage.removeItem(EXAM_MODE_KEY);
  }

  static handleExpiredSession(session: LockInModeState): void {
    this.addToHistory({
      sessionId: session.sessionId,
      examId: session.examId,
      courseCode: session.courseCode,
      examName: session.examName,
      startTime: session.startTime,
      endTime: Date.now(),
      totalDuration: session.totalDuration,
      timeUsed: session.totalDuration,
      completed: false,
      expired: true,
      reason: "expired",
    });

    localStorage.removeItem(EXAM_MODE_KEY);
  }

  static cleanupStaleSession(session: LockInModeState): void {
    this.addToHistory({
      sessionId: session.sessionId,
      examId: session.examId,
      courseCode: session.courseCode,
      examName: session.examName,
      startTime: session.startTime,
      endTime: Date.now(),
      totalDuration: session.totalDuration,
      timeUsed: 0,
      completed: false,
      expired: false,
      reason: "stale",
    });

    localStorage.removeItem(EXAM_MODE_KEY);
  }

  static forceEndSession(session: LockInModeState, reason: string): void {
    this.addToHistory({
      sessionId: session.sessionId,
      examId: session.examId,
      courseCode: session.courseCode,
      examName: session.examName,
      startTime: session.startTime,
      endTime: Date.now(),
      totalDuration: session.totalDuration,
      timeUsed: session.totalDuration - this.getTimeRemaining(),
      completed: false,
      expired: false,
      reason,
    });

    localStorage.removeItem(EXAM_MODE_KEY);
  }

  static addToHistory(sessionData: LockInModeSession): void {
    try {
      const history = this.getSessionHistory();
      history.push(sessionData);

      const trimmedHistory = history.slice(-50);

      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.warn("Failed to save exam session to history");
    }
  }

  static getSessionHistory(): LockInModeSession[] {
    try {
      const stored = localStorage.getItem(EXAM_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  static cleanupHistory(): void {
    const history = this.getSessionHistory();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const recentHistory = history.filter(
      (session) => session.startTime > thirtyDaysAgo,
    );
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(recentHistory));
  }

  static clearHistory(): void {
    localStorage.removeItem(EXAM_HISTORY_KEY);
  }

  static formatTime(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  static isPaused(): boolean {
    const session = this.getCurrentSession();
    return session ? !!session.pausedAt : false;
  }
}
