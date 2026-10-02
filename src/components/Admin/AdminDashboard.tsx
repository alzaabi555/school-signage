import React, { useState } from 'react';
import {
  SchoolSettings,
  Substitution,
  DutyItem,
  Period,
  Announcement,
  ClassScheduleItem,
  SubstitutionStatus,
} from '../../types';
import { AdminTabType } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { SubstitutionsTab } from './SubstitutionsTab';
import { DutyScheduleTab } from './DutyScheduleTab';
import { TimetableTab } from './TimetableTab';
import { AnnouncementsTab } from './AnnouncementsTab';
import { IntegrationGuideTab } from './IntegrationGuideTab';
import { AnalyticsTab } from './AnalyticsTab';
import { BackupRestoreTab } from './BackupRestoreTab';
import { FullSchoolBackup } from '../../utils/backupRestoreUtils';
import { AppStateData } from '../../types';
import { Menu, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  settings: SchoolSettings;
  substitutions: Substitution[];
  duties: DutyItem[];
  daySubjectDuties?: Record<string, { subject: string; departmentLead: string; notes?: string }>;
  onUpdateDaySubjectDuty?: (day: string, subject: string, departmentLead: string, notes?: string) => Promise<void>;
  periods: Period[];
  announcements: Announcement[];
  timetable: ClassScheduleItem[];
  stateData?: AppStateData;
  femaleTeachers?: string[];
  onBackupRestored?: (backup: FullSchoolBackup) => Promise<void> | void;
  onSwitchToDisplay: () => void;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onAddSubstitution: (sub: Omit<Substitution, 'id'>) => Promise<void>;
  onBulkAddSubstitutions?: (subs: Omit<Substitution, 'id'>[]) => Promise<void>;
  onDeleteSubstitution: (id: string) => Promise<void>;
  onUpdateSubstitutionStatus: (id: string, status: SubstitutionStatus) => Promise<void>;
  onUpdateDuty: (duty: DutyItem) => Promise<void>;
  onAddDuty: (duty: Omit<DutyItem, 'id'>) => Promise<void>;
  onDeleteDuty?: (id: string) => Promise<void>;
  onClearAllDuties?: () => Promise<void>;
  onClearAllSubstitutions?: () => Promise<void>;
  onUpdatePeriods: (periods: Period[]) => Promise<void>;
  onAddTimetableItem: (item: Omit<ClassScheduleItem, 'id'>) => Promise<void>;
  onDeleteTimetableItem: (id: string) => Promise<void>;
  onBulkReplaceTimetable: (items: ClassScheduleItem[]) => Promise<{ success: boolean; message: string; count?: number; operation?: string } | void> | void;
  onAddAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  onToggleAnnouncementActive: (id: string, active: boolean) => Promise<void>;
  onTestConnection: () => Promise<boolean>;
  onForceSync: () => Promise<void>;
  onUploadAllToFirebase?: () => Promise<{ success: boolean; message: string }>;
  isOnline: boolean;
  isTesting: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  isSubmitting: boolean;
  saveStatusMsg: string | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  substitutions,
  duties,
  daySubjectDuties,
  onUpdateDaySubjectDuty,
  periods,
  announcements,
  timetable,
  stateData: explicitStateData,
  femaleTeachers,
  onBackupRestored,
  onSwitchToDisplay,
  onUpdateSettings,
  onAddSubstitution,
  onBulkAddSubstitutions,
  onDeleteSubstitution,
  onUpdateSubstitutionStatus,
  onUpdateDuty,
  onAddDuty,
  onDeleteDuty,
  onClearAllDuties,
  onClearAllSubstitutions,
  onUpdatePeriods,
  onAddTimetableItem,
  onDeleteTimetableItem,
  onBulkReplaceTimetable,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncementActive,
  onTestConnection,
  onForceSync,
  onUploadAllToFirebase,
  isOnline,
  isTesting,
  isSyncing,
  lastSyncTime,
  isSubmitting,
  saveStatusMsg,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('substitutions');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const getTabLabel = (tab: AdminTabType): string => {
    switch (tab) {
      case 'substitutions':
        return 'إدارة الاحتياط اليومي';
      case 'duty':
        return 'المناوبة والإشراف اليومي';
      case 'timetable':
        return 'أوقات الحصص والجدول المدرسي';
      case 'analytics':
        return 'لوحة الإحصائيات والرسوم';
      case 'announcements':
        return 'شريط الأخبار والتنبيهات';
      case 'integration':
        return 'المزامنة مع Google Sheets';
      case 'backup':
        return 'النسخ الاحتياطي والاسترداد (JSON)';
      default:
        return 'لوحة التحكم';
    }
  };

  const getTabFullTitle = (tab: AdminTabType): string => {
    switch (tab) {
      case 'substitutions':
        return 'إدارة وتوزيع الاحتياط اليومي وتكليف الحصص';
      case 'duty':
        return 'جدول المناوبة والإشراف اليومي ومواقع المدرسة';
      case 'timetable':
        return 'أوقات الحصص والجدول المدرسي العام (32 فصلاً)';
      case 'analytics':
        return 'لوحة الإحصائيات والرسوم البيانية التفاعلية';
      case 'announcements':
        return 'شريط الأخبار والتنبيهات المدرسية المباشرة';
      case 'integration':
        return 'المزامنة مع Google Sheets وإعدادات الربط السحابي';
      case 'backup':
        return 'النسخ الاحتياطي الشامل والاسترداد (ملف JSON)';
      default:
        return 'لوحة الإشراف والمتابعة';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col lg:flex-row font-['Cairo',sans-serif]">
      {/* 1. القائمة الجانبية العصرية المطابقة للتصميم المطلوب (الصورة الثانية) */}
      <AdminSidebar
        settings={settings}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSwitchToDisplay={onSwitchToDisplay}
        isOnline={isOnline}
        isSaving={isSubmitting}
        saveStatusMsg={saveStatusMsg}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. منطقة العمل والمحتوى الرئيسي للوحة الإشراف */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* شريط الإدارة العلوي المصاحب والمساعد */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            {/* زر فتح القائمة الجانبية في الشاشات الصغيرة والمتوسطة */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition cursor-pointer"
              title="فتح القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>لوحة إشراف الجداول</span>
                <span>/</span>
                <span className="text-slate-700 font-bold">{getTabLabel(activeTab)}</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 font-['Cairo'] flex items-center gap-2">
                {getTabFullTitle(activeTab)}
              </h1>
            </div>
          </div>

          {/* أزرار سريعة ومؤشرات إضافية في رأس الصفحة */}
          <div className="flex items-center gap-2 sm:gap-3">
            {saveStatusMsg && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold animate-fade-in">
                {isSubmitting ? 'جارٍ الحفظ والتحديث...' : saveStatusMsg}
              </span>
            )}

            <button
              type="button"
              onClick={onForceSync}
              disabled={isSyncing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="مزامنة فورية"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'جارٍ المزامنة...' : 'مزامنة'}</span>
            </button>
          </div>
        </header>

        {/* المحتوى الرئيسي للوحة التحكم */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'substitutions' && (
          <SubstitutionsTab
            substitutions={substitutions}
            periods={periods}
            timetable={timetable}
            onAddSubstitution={onAddSubstitution}
            onBulkAddSubstitutions={onBulkAddSubstitutions}
            onDeleteSubstitution={onDeleteSubstitution}
            onUpdateStatus={onUpdateSubstitutionStatus}
            onClearAllSubstitutions={onClearAllSubstitutions}
            onBulkReplaceTimetable={onBulkReplaceTimetable}
            isSubmitting={isSubmitting}
            gasUrl={settings.gasUrl}
          />
        )}

        {activeTab === 'duty' && (
          <DutyScheduleTab
            duties={duties}
            timetable={timetable}
            daySubjectDuties={daySubjectDuties}
            onUpdateDaySubjectDuty={onUpdateDaySubjectDuty}
            onUpdateDuty={onUpdateDuty}
            onAddDuty={onAddDuty}
            onDeleteDuty={onDeleteDuty}
            onClearAllDuties={onClearAllDuties}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableTab
            periods={periods}
            timetable={timetable}
            substitutions={substitutions}
            onAddSubstitution={onAddSubstitution}
            onDeleteSubstitution={onDeleteSubstitution}
            onUpdateSubstitutionStatus={onUpdateSubstitutionStatus}
            onUpdatePeriods={onUpdatePeriods}
            onAddTimetableItem={onAddTimetableItem}
            onDeleteTimetableItem={onDeleteTimetableItem}
            onBulkReplaceTimetable={onBulkReplaceTimetable}
            isSubmitting={isSubmitting}
            gasUrl={settings.gasUrl}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            substitutions={substitutions}
            timetable={timetable}
            periods={periods}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsTab
            announcements={announcements}
            onAddAnnouncement={onAddAnnouncement}
            onDeleteAnnouncement={onDeleteAnnouncement}
            onToggleActive={onToggleAnnouncementActive}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'integration' && (
          <IntegrationGuideTab
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onTestConnection={onTestConnection}
            onForceSync={onForceSync}
            onUploadAllToFirebase={onUploadAllToFirebase}
            isTesting={isTesting}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
          />
        )}

        {activeTab === 'backup' && (
          <BackupRestoreTab
            settings={settings}
            stateData={
              explicitStateData || {
                substitutions,
                duties,
                daySubjectDuties,
                periods,
                announcements,
                timetable,
                lastSyncTime,
              }
            }
            femaleTeachers={femaleTeachers}
            onBackupRestored={onBackupRestored || (() => {})}
          />
        )}
      </main>
    </div>
  </div>
  );
};
