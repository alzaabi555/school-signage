import React, { useState } from 'react';
import { SchoolSettings } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { useFirebase } from '../../contexts/FirebaseContext';
import { AdminAuthModal } from './AdminAuthModal';
import {
  Tv,
  Users,
  ShieldCheck,
  Calendar,
  Megaphone,
  Database,
  ArrowRight,
  BarChart3,
  Lock,
  Flame,
  LogIn,
  LogOut,
  UserCheck,
  FolderArchive,
} from 'lucide-react';

export type AdminTabType = 'substitutions' | 'duty' | 'timetable' | 'analytics' | 'announcements' | 'integration' | 'backup';

interface AdminHeaderProps {
  settings: SchoolSettings;
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  onSwitchToDisplay: () => void;
  isOnline: boolean;
  isSaving: boolean;
  saveStatusMsg: string | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  settings,
  activeTab,
  onSelectTab,
  onSwitchToDisplay,
  isOnline,
  isSaving,
  saveStatusMsg,
}) => {
  const { currentUser, isFirestoreConnected } = useFirebase();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const tabs = [
    { id: 'substitutions' as AdminTabType, label: 'الاحتياط اليومي', icon: <Users className="w-4 h-4" /> },
    { id: 'duty' as AdminTabType, label: 'المناوبة والإشراف', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'timetable' as AdminTabType, label: 'أوقات الحصص والجدول', icon: <Calendar className="w-4 h-4" /> },
    { id: 'analytics' as AdminTabType, label: 'لوحة الإحصائيات والرسوم', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'announcements' as AdminTabType, label: 'شريط الأخبار', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'integration' as AdminTabType, label: 'الربط بـ Sheets والنشر', icon: <Database className="w-4 h-4" /> },
    { id: 'backup' as AdminTabType, label: 'النسخ الاحتياطي (JSON)', icon: <FolderArchive className="w-4 h-4 text-violet-600" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* الشريط العلوي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
            <SchoolLogo className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900 font-['Cairo']">
                لوحة اشراف الجدول والاحتياط والمناوبة
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isOnline ? 'مزامنة مع Google Sheets' : 'التخزين المحلي'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                isFirestoreConnected
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <Flame className="w-3 h-3 text-orange-500" />
                <span>{isFirestoreConnected ? 'Firebase سحابي نشط' : 'Firebase جاري الفحص'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {settings.schoolName?.replace('(32 فصلاً)', '').trim() || 'الإبداع للبنين'} — تحديث ومتابعة فورية للجداول والاحتياط
            </p>
          </div>
        </div>

        {/* حالة الحفظ وحساب Google وزر العودة إلى شاشة العرض */}
        <div className="flex items-center gap-3 flex-wrap">
          {saveStatusMsg && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-fade-in font-bold">
              {isSaving ? 'جارٍ الإرسال...' : saveStatusMsg}
            </span>
          )}

          {/* حساب المشرف في Firebase Auth */}
          {currentUser ? (
            <div
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition"
              title="إدارة جلسة المشرف وخدمات السحابة"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                {currentUser.displayName ? currentUser.displayName[0] : 'أ'}
              </div>
              <span className="text-slate-700 font-semibold truncate max-w-[120px]">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition border border-indigo-200 text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
              title="تسجيل دخول المشرف وربط السحابة"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>دخول المشرف (السحابة)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSwitchToDisplay}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition border border-rose-200 text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
            title="قفل لوحة الإدارة والخروج"
          >
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            <span>قفل اللوحة 🔒</span>
          </button>

          <button
            onClick={onSwitchToDisplay}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow font-bold text-xs transition active:scale-95 border border-emerald-600"
          >
            <Tv className="w-4 h-4" />
            <span>عرض الشاشة الكبيرة (TV)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* شريط التبويبات المتجاوب للهاتف والكمبيوتر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto scrollbar-none gap-1.5 pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};
