import type { EvaluationReport, EvaluationCategory, EvaluationSeverity, AuthUser } from '../types/auth';

export const ROUTE_DESTINATION_EMAIL = 'anand.com@gmail.com';
const REPORTS_STORAGE_KEY = 'guten_evaluation_reports_v1';

class EvaluationReportService {
  private reports: EvaluationReport[] = [];

  constructor() {
    this.loadReports();
  }

  private loadReports() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) {
        this.reports = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse Guten evaluation reports:', e);
    }
  }

  private saveReports() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(this.reports));
  }

  public createReport(
    reporter: AuthUser,
    data: {
      category: EvaluationCategory;
      severity: EvaluationSeverity;
      activeModuleTitle: string;
      title: string;
      description: string;
      stepsToReproduce?: string;
      expectedBehavior?: string;
      actualBehavior?: string;
    }
  ): EvaluationReport {
    const report: EvaluationReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      reporter,
      ...data,
      systemDiagnostics: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        screenResolution:
          typeof window !== 'undefined'
            ? `${window.innerWidth}x${window.innerHeight} (${window.screen.width}x${window.screen.height})`
            : 'Unknown',
        speechSupport:
          typeof window !== 'undefined' && 'speechSynthesis' in window,
        appUrl: typeof window !== 'undefined' ? window.location.href : 'http://localhost'
      }
    };

    this.reports.unshift(report);
    this.saveReports();
    return report;
  }

  public getReports(): EvaluationReport[] {
    return this.reports;
  }

  public formatReportText(report: EvaluationReport): string {
    return [
      `==================================================`,
      `GUTEN APP - DEUTSCHE AKADEMIE EVALUATIONSBERICHT`,
      `==================================================`,
      `Datum/Uhrzeit: ${new Date(report.timestamp).toLocaleString('de-DE')}`,
      `Tester / Benutzer: ${report.reporter.displayName} (@${report.reporter.username}) [${report.reporter.role.toUpperCase()}]`,
      `Kategorie: ${report.category.toUpperCase()}`,
      `Dringlichkeit (Severity): ${report.severity.toUpperCase()}`,
      `Aktives Modul: ${report.activeModuleTitle}`,
      `--------------------------------------------------`,
      `TITEL: ${report.title}`,
      `--------------------------------------------------`,
      `BESCHREIBUNG:`,
      report.description,
      ``,
      report.stepsToReproduce
        ? `SCHRITTE ZUR REPRODUKTION:\n${report.stepsToReproduce}\n`
        : '',
      report.expectedBehavior
        ? `ERWARTETES VERHALTEN:\n${report.expectedBehavior}\n`
        : '',
      report.actualBehavior
        ? `TATSÄCHLICHES VERHALTEN:\n${report.actualBehavior}\n`
        : '',
      `--------------------------------------------------`,
      `SYSTEMDIAGNOSE:`,
      `App URL: ${report.systemDiagnostics.appUrl}`,
      `Bildschirm: ${report.systemDiagnostics.screenResolution}`,
      `Web Speech API aktiv: ${report.systemDiagnostics.speechSupport ? 'Ja' : 'Nein'}`,
      `Browser/User Agent: ${report.systemDiagnostics.userAgent}`,
      `==================================================`,
      `Automatisch geroutet an: ${ROUTE_DESTINATION_EMAIL}`
    ]
      .filter(line => line !== '')
      .join('\n');
  }

  public buildMailtoUrl(report: EvaluationReport): string {
    const subject = encodeURIComponent(
      `[Guten App ${report.severity.toUpperCase()}] ${report.category.toUpperCase()}: ${report.title}`
    );
    const body = encodeURIComponent(this.formatReportText(report));
    return `mailto:${ROUTE_DESTINATION_EMAIL}?subject=${subject}&body=${body}`;
  }
}

export const evaluationReportService = new EvaluationReportService();
