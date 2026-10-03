import React from 'react';
import { SchoolSettings } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { useFirebase } from '../../contexts/FirebaseContext';
import {
  Tv,
  Lock,
  LogIn,
  LogOut,
  ClipboardCheck,
  ShieldCheck,
  Calendar,
  BarChart3,
  Megaphone,
  Upload,
  FolderArchive,
  Flame,
  X,
  Code2,
} from 'lucide-react';
import { AdminTabType } from './AdminHeader';

interface AdminSidebarProps {
  settings: SchoolSettings;
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  onSwitchToDisplay: () => void;
  onOpenAuthModal?: () => void;
  isOnline: boolean;
  isSaving: boolean;
  saveStatusMsg: string | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AdminTabType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  settings,
  activeTab,
  onSelectTab,
  onSwitchToDisplay,
  onOpenAuthModal,
  isOnline,
  isSaving,
  saveStatusMsg,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, isFirestoreConnected, logOut } = useFirebase();

  const navItems: NavItem[] = [
    {
      id: 'substitutions',
      label: 'إدارة الاحتياط اليومي',
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
    {
      id: 'duty',
      label: 'المناوبة والإشراف اليومي',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      id: 'timetable',
      label: 'أوقات الحصص والجدول المدرسي',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'لوحة الإحصائيات والرسوم',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'announcements',
      label: 'شريط الأخبار والتنبيهات',
      icon: <Megaphone className="w-5 h-5" />,
    },
    {
      id: 'integration',
      label: 'المزامنة مع Google Sheets',
      icon: <Upload className="w-5 h-5" />,
    },
    {
      id: 'backup',
      label: 'النسخ الاحتياطي والاسترداد (JSON)',
      icon: <FolderArchive className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (tabId: AdminTabType) => {
    onSelectTab(tabId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 p-4 sm:p-5 select-none font-['Cairo',sans-serif]">
      {/* رأس القائمة الجانبية: الشعار وهوية المدرسة وزر الإغلاق في الجوال */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-center p-1 shadow-2xs shrink-0">
            <SchoolLogo className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 font-['Cairo'] tracking-tight">
              {settings.schoolName?.replace('(32 فصلاً)', '').trim() || 'الإبداع للبنين'}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              لوحة إشراف الجداول والاحتياط
            </p>
          </div>
        </div>

        {/* زر إغلاق القائمة في الشاشات الصغيرة */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="إغلاق القائمة"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* بطاقات العمليات العلوية بتنسيق فاتح أنيق متماشي مع هوية الموقع */}
      <div className="space-y-2.5 mb-5">
        {/* زر الدخول المعتمد بحساب Google Workspace */}
        {currentUser ? (
          <div className="w-full bg-indigo-50/70 border border-indigo-200 text-indigo-900 rounded-2xl p-2.5 flex items-center justify-between shadow-2xs">
            <div
              onClick={() => onOpenAuthModal?.()}
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer hover:opacity-85 transition"
              title="إدارة جلسة المشرف"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser.displayName ? currentUser.displayName[0] : 'أ'}
              </div>
              <div className="truncate text-right">
                <span className="block text-xs font-bold text-indigo-950 truncate leading-tight">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <span className="block text-[10px] text-indigo-600 font-semibold truncate leading-tight mt-0.5">
                  حساب معتمد (مشرف)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => logOut()}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition shrink-0"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenAuthModal?.()}
            className="w-full bg-indigo-50/80 hover:bg-indigo-100/90 active:scale-[0.99] border border-indigo-200/90 text-indigo-900 rounded-2xl py-3 px-3.5 font-bold text-xs flex items-center justify-between transition-all shadow-2xs cursor-pointer group"
          >
            <span className="font-['Cairo'] text-indigo-900 group-hover:text-indigo-950 transition-colors">
              دخول المشرف (السحابة والخدمات)
            </span>
            <LogIn className="w-4 h-4 text-indigo-600 group-hover:scale-105 transition-transform" />
          </button>
        )}

        {/* زران متجاوران: قفل اللوحة وشاشة العرض (TV) */}
        <div className="grid grid-cols-2 gap-2">
          {/* زر قفل اللوحة (يمين) */}
          <button
            type="button"
            onClick={onSwitchToDisplay}
            className="bg-amber-50/80 hover:bg-amber-100 active:scale-[0.98] border border-amber-200 text-amber-900 rounded-2xl p-2.5 flex items-center justify-between text-xs font-bold transition shadow-2xs cursor-pointer group"
            title="قفل لوحة الإشراف ومنع التعديل"
          >
            <span className="text-[11px] font-bold font-['Cairo'] text-amber-900">قفل اللوحة</span>
            <Lock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </button>

          {/* زر شاشة العرض (TV) (يسار) */}
          <button
            type="button"
            onClick={onSwitchToDisplay}
            className="bg-teal-50/80 hover:bg-teal-100 active:scale-[0.98] border border-teal-200 text-teal-900 rounded-2xl p-2.5 flex items-center justify-between text-xs font-bold transition shadow-2xs cursor-pointer group"
            title="الانتقال إلى شاشة العرض الكبيرة للمدرسة"
          >
            <div className="text-right leading-tight">
              <span className="block text-[11px] font-bold font-['Cairo'] text-teal-900">شاشة العرض</span>
              <span className="block text-[10px] text-teal-700 font-semibold">(TV)</span>
            </div>
            <Tv className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* خط فاصل ناعم */}
      <div className="h-px bg-slate-100 mb-3" />

      {/* قائمة صفحات وأقسام لوحة الإشراف (القائمة الجانبية الرئيسية) */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-[13px] font-bold font-['Cairo'] transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <span>{item.label}</span>
              <span className={`shrink-0 ml-1 transition-transform ${isActive ? 'text-white scale-105' : 'text-slate-400'}`}>
                {item.icon}
              </span>
            </button>
          );
        })}
      </div>

      {/* تذييل القائمة الجانبية: مؤشرات الحالة والمعلومات */}
      <div className="pt-4 mt-auto border-t border-slate-100 space-y-2.5">
        {/* شارة حالة المزامنة والسحابة */}
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold">
          <span
            className={`px-2 py-0.5 rounded-full border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isOnline ? 'مزامنة مع Google Sheets' : 'التخزين المحلي'}
          </span>

          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
              isFirestoreConnected
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Flame className="w-2.5 h-2.5 text-orange-500" />
            <span>{isFirestoreConnected ? 'Firebase نشط' : 'محلي'}</span>
          </span>
        </div>

        {/* إشعار الحفظ التلقائي إن وجد */}
        {saveStatusMsg && (
          <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl font-bold text-center">
            {isSaving ? 'جارٍ الحفظ...' : saveStatusMsg}
          </div>
        )}

        {/* توقيع مشرف النظام */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Code2 className="w-3 h-3 text-slate-400" />
            <span>مشرف النظام: محمد درويش الزعابي</span>
          </div>
          <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold">v2.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. القائمة الجانبية الثابتة للشاشات الكبيرة (Desktop Sidebar) */}
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0 h-screen sticky top-0 bg-white border-l border-slate-200/90 z-30 shadow-xs">
        {sidebarContent}
      </aside>

      {/* 2. القائمة الجانبية المنبثقة للجوال والأجهزة اللوحية (Mobile / Tablet Drawer) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* خلفية معتمة عند الفتح */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* لوحة القائمة المنزلقة من اليمين (RTL) */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full shadow-2xl z-50 animate-slide-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
