import { Exam } from "@/components/data-table/columns";

// Main exam session state
export interface ExamModeState {
  isActive: boolean;
  examId: string;
  courseCode: string;
  examName: string;
  startTime: number;
  totalDuration: number; // in milliseconds
  pausedAt?: number;
  totalPausedTime: number;
  sessionId: string;
  lastActivity: number;
}

// Session history for analytics
export interface ExamSession {
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
  reason?: string; // 'completed' | 'expired' | 'stale' | 'replaced'
}

// Storage keys
const EXAM_MODE_KEY = "examMode";
const EXAM_HISTORY_KEY = "examHistory";
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export class ExamModeManager {
  // Check and clean up on app load
  static initializeExamMode(): ExamModeState | null {
    console.log("ExamModeManager: initializeExamMode called");
    const currentSession = this.getCurrentSession();
    console.log(
      "ExamModeManager: Current session from storage:",
      currentSession
    );

    if (currentSession) {
      console.log("ExamModeManager: Session found, checking validity...");

      // Check if session is stale (24+ hours old)
      if (this.isSessionStale(currentSession)) {
        console.log("ExamModeManager: Session is stale, cleaning up");
        this.cleanupStaleSession(currentSession);
        return null;
      }

      // Check if time has expired
      if (this.isTimeExpired(currentSession)) {
        console.log("ExamModeManager: Session has expired");
        this.handleExpiredSession(currentSession);
        return null;
      }

      console.log("ExamModeManager: Valid active session found");
      // Valid active session - should redirect to exam mode
      return currentSession;
    }

    console.log("ExamModeManager: No session found");
    return null;
  }

  // Start new exam session
  static startExamSession(exam: Exam, durationMinutes: number): ExamModeState {
    // First, clean up any existing session
    const existing = this.getCurrentSession();
    if (existing) {
      this.forceEndSession(existing, "replaced");
    }

    const session: ExamModeState = {
      isActive: true,
      examId: exam.id.toString(),
      courseCode: exam.kurskod,
      examName: exam.tenta_namn,
      startTime: Date.now(),
      totalDuration: durationMinutes * 60 * 1000,
      totalPausedTime: 0,
      sessionId: crypto.randomUUID(),
      lastActivity: Date.now(),
    };

    localStorage.setItem(EXAM_MODE_KEY, JSON.stringify(session));
    return session;
  }

  // Get current session with validation
  static getCurrentSession(): ExamModeState | null {
    try {
      console.log("ExamModeManager: Getting session from localStorage...");
      const stored = localStorage.getItem(EXAM_MODE_KEY);
      console.log("ExamModeManager: Raw stored data:", stored);

      if (!stored) {
        console.log("ExamModeManager: No stored session found");
        return null;
      }

      const session = JSON.parse(stored);
      console.log("ExamModeManager: Parsed session:", session);

      // Validate session structure
      if (!this.isValidSession(session)) {
        console.log("ExamModeManager: Session is invalid, removing");
        localStorage.removeItem(EXAM_MODE_KEY);
        return null;
      }

      console.log("ExamModeManager: Valid session found");
      return session;
    } catch (error) {
      console.log("ExamModeManager: Error parsing session:", error);
      // Data corruption - clean up
      localStorage.removeItem(EXAM_MODE_KEY);
      return null;
    }
  }

  // Update last activity (call on any user interaction)
  static updateActivity(): void {
    const session = this.getCurrentSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem(EXAM_MODE_KEY, JSON.stringify(session));
    }
  }

  // Pause/Resume functionality
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

  // Calculate remaining time
  static getTimeRemaining(): number {
    const session = this.getCurrentSession();
    if (!session) return 0;

    const now = Date.now();
    let elapsed = now - session.startTime - session.totalPausedTime;

    // If currently paused, don't count time since pause
    if (session.pausedAt) {
      elapsed -= now - session.pausedAt;
    }

    return Math.max(0, session.totalDuration - elapsed);
  }

  // Check if time has expired
  static isTimeExpired(session?: ExamModeState): boolean {
    const currentSession = session || this.getCurrentSession();
    if (!currentSession) return false;
    return this.getTimeRemaining() <= 0;
  }

  // Check if session is stale (24+ hours old)
  static isSessionStale(session: ExamModeState): boolean {
    return Date.now() - session.lastActivity > SESSION_TIMEOUT;
  }

  // Validate session data structure
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

  // Complete exam successfully
  static completeSession(): void {
    const session = this.getCurrentSession();
    if (!session) return;

    const timeUsed = session.totalDuration - this.getTimeRemaining();

    // Add to history
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

    // Clean up active session
    localStorage.removeItem(EXAM_MODE_KEY);
  }

  // Handle expired session
  static handleExpiredSession(session: ExamModeState): void {
    this.addToHistory({
      sessionId: session.sessionId,
      examId: session.examId,
      courseCode: session.courseCode,
      examName: session.examName,
      startTime: session.startTime,
      endTime: Date.now(),
      totalDuration: session.totalDuration,
      timeUsed: session.totalDuration, // Full time used
      completed: false,
      expired: true,
      reason: "expired",
    });

    localStorage.removeItem(EXAM_MODE_KEY);
  }

  // Clean up stale session
  static cleanupStaleSession(session: ExamModeState): void {
    this.addToHistory({
      sessionId: session.sessionId,
      examId: session.examId,
      courseCode: session.courseCode,
      examName: session.examName,
      startTime: session.startTime,
      endTime: Date.now(),
      totalDuration: session.totalDuration,
      timeUsed: 0, // Unknown time used
      completed: false,
      expired: false,
      reason: "stale",
    });

    localStorage.removeItem(EXAM_MODE_KEY);
  }

  // Force end session (for cleanup)
  static forceEndSession(session: ExamModeState, reason: string): void {
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

  // Session history management
  static addToHistory(sessionData: ExamSession): void {
    try {
      const history = this.getSessionHistory();
      history.push(sessionData);

      // Keep only last 50 sessions to prevent localStorage bloat
      const trimmedHistory = history.slice(-50);

      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.warn("Failed to save exam session to history");
    }
  }

  static getSessionHistory(): ExamSession[] {
    try {
      const stored = localStorage.getItem(EXAM_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  // Cleanup old history entries (call periodically)
  static cleanupHistory(): void {
    const history = this.getSessionHistory();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const recentHistory = history.filter(
      (session) => session.startTime > thirtyDaysAgo
    );
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(recentHistory));
  }

  static clearHistory(): void {
    localStorage.removeItem(EXAM_HISTORY_KEY);
  }

  // Utility methods
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
