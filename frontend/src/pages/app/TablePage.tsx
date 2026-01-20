import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Plus, ExternalLink, Archive, RotateCcw, Building2 } from 'lucide-react';
import { useProjectStore, getProjectStage } from '../../store/projectStore';
import { useUserRole } from '../../store/authStore';
import { projectsApi } from '../../api/projects';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import ProgressBar from '../../components/ui/ProgressBar';
import PriorityLight from '../../components/ui/PriorityLight';
import Loader from '../../components/ui/Loader';
import ProjectFormModal from '../../components/projects/ProjectFormModal';

export default function TablePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { departmentKey, userDepartment, isAdmin, canEditProject, canEdit } = useUserRole();
  const {
    projects,
    stages,
    departments,
    isLoading,
    fetchProjects,
    fetchStages,
    fetchDepartments,
  } = useProjectStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [specialFilter, setSpecialFilter] = useState(''); // overdue, dueSoon
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Читаем фильтры из URL при загрузке
  useEffect(() => {
    const filter = searchParams.get('filter');
    const dept = searchParams.get('department');
    
    if (filter === 'active') {
      setStatusFilter('ACTIVE');
    } else if (filter === 'archived') {
      setStatusFilter('ARCHIVED');
    } else if (filter === 'overdue') {
      setSpecialFilter('overdue');
    } else if (filter === 'dueSoon') {
      setSpecialFilter('dueSoon');
    }
    
    if (dept) {
      setDeptFilter(dept);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchStages();
    fetchDepartments();
  }, [fetchStages, fetchDepartments]);

  // Загрузка проектов с фильтрами
  useEffect(() => {
    const loadProjects = async () => {
      const filters: Record<string, string | undefined> = {};
      
      // Admin (SuperAdmin) может видеть все отделы и фильтровать
      // Lead и Member видят только свой отдел
      if (isAdmin) {
        // Admin может фильтровать по любому отделу
        if (deptFilter) {
          filters.department = deptFilter;
        }
      } else if (departmentKey) {
        // Lead и Member видят только свой отдел
        filters.department = departmentKey;
      }
      
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      await fetchProjects(filters);
    };
    
    const timer = setTimeout(loadProjects, 300);
    return () => clearTimeout(timer);
  }, [deptFilter, statusFilter, searchTerm, isAdmin, departmentKey, fetchProjects]);

  // Фильтрация на клиенте для overdue/dueSoon/priority
  const filteredProjects = projects.filter((project) => {
    if (specialFilter === 'overdue' && !project.overdue) return false;
    if (specialFilter === 'dueSoon' && !project.dueSoon) return false;
    if (priorityFilter && project.priorityLight !== priorityFilter) return false;
    return true;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDeptFilter('');
    setPriorityFilter('');
    setSpecialFilter('');
    setSearchParams({});
  };

  const handleArchive = async (documentId: string) => {
    try {
      await projectsApi.archive(documentId);
      fetchProjects();
    } catch (error) {
      console.error('Failed to archive:', error);
    }
  };

  const handleRestore = async (documentId: string) => {
    try {
      await projectsApi.restore(documentId);
      fetchProjects();
    } catch (error) {
      console.error('Failed to restore:', error);
    }
  };

  const getDepartmentName = (dept?: { name_ru: string; name_kz: string }) => {
    if (!dept) return '';
    return i18n.language === 'kz' ? dept.name_kz : dept.name_ru;
  };

  const getStageName = (project: any) => {
    const stage = getProjectStage(project, stages);
    if (!stage) return '';
    return i18n.language === 'kz' ? stage.name_kz : stage.name_ru;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU');
  };

  const getUserDepartmentName = () => {
    if (!userDepartment) return 'Все отделы';
    return i18n.language === 'kz' ? userDepartment.name_kz : userDepartment.name_ru;
  };

  // Опции фильтров
  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'ACTIVE', label: t('status.ACTIVE') },
    { value: 'ARCHIVED', label: t('status.ARCHIVED') },
  ];

  const departmentOptions = [
    { value: '', label: 'Все отделы' },
    ...departments.map((d) => ({
      value: d.key,
      label: getDepartmentName(d),
    })),
  ];

  const priorityOptions = [
    { value: '', label: 'Все приоритеты' },
    { value: 'RED', label: t('priority.RED') },
    { value: 'YELLOW', label: t('priority.YELLOW') },
    { value: 'GREEN', label: t('priority.GREEN') },
  ];

  const specialOptions = [
    { value: '', label: 'Все проекты' },
    { value: 'overdue', label: 'Просроченные' },
    { value: 'dueSoon', label: 'Скоро дедлайн' },
  ];

  // Только SuperAdmin может фильтровать по отделам
  const canFilterByDept = isAdmin;

  if (isLoading && projects.length === 0) {
    return <Loader text={t('common.loading')} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">
            {t('table.title')}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-slate-400" />
            {isAdmin ? (
              <span className="text-slate-500">SuperAdmin • Все отделы</span>
            ) : (
              <Badge variant={userDepartment?.key === 'IT' ? 'it' : userDepartment?.key === 'DIGITALIZATION' ? 'digital' : 'default'}>
                {getUserDepartmentName()}
              </Badge>
            )}
            <span className="text-slate-500">• {filteredProjects.length} проект(ов)</span>
          </div>
        </div>
        {canEditProject && (
          <Button onClick={() => setShowCreateModal(true)} icon={<Plus className="w-4 h-4" />}>
            {t('project.createProject')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {/* Фильтр по отделу - только для руководителей */}
          {canFilterByDept && (
            <div className="w-40">
              <Select
                options={departmentOptions}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              />
            </div>
          )}
          
          <div className="w-36">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          
          <div className="w-40">
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
          
          <div className="w-40">
            <Select
              options={specialOptions}
              value={specialFilter}
              onChange={(e) => setSpecialFilter(e.target.value)}
            />
          </div>
          
          <Button variant="ghost" onClick={handleClearFilters} icon={<Filter className="w-4 h-4" />}>
            Сбросить
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                <th className="px-4 py-3 font-medium">{t('project.title')}</th>
                <th className="px-4 py-3 font-medium">{t('project.department')}</th>
                <th className="px-4 py-3 font-medium">{t('project.startDate')}</th>
                <th className="px-4 py-3 font-medium">{t('project.dueDate')}</th>
                <th className="px-4 py-3 font-medium w-40">{t('project.progress')}</th>
                <th className="px-4 py-3 font-medium">{t('project.stage')}</th>
                <th className="px-4 py-3 font-medium text-center">{t('project.priority')}</th>
                <th className="px-4 py-3 font-medium">{t('project.status')}</th>
                <th className="px-4 py-3 font-medium text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    {t('project.noProjects')}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Название - кликабельное */}
                        <button
                          onClick={() => navigate(`/app/projects/${project.documentId}`)}
                          className="font-medium text-slate-800 hover:text-primary-600 hover:underline text-left"
                        >
                          {project.title}
                        </button>
                        {project.overdue && (
                          <Badge variant="danger" size="sm">{t('project.overdue')}</Badge>
                        )}
                        {project.dueSoon && !project.overdue && (
                          <Badge variant="warning" size="sm">{t('project.dueSoon')}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {project.department && (
                        <Badge
                          variant={project.department.key === 'IT' ? 'it' : 'digital'}
                          size="sm"
                        >
                          {getDepartmentName(project.department)}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(project.startDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(project.dueDate)}
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar value={project.progressPercent || 0} showLabel size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-600">{getStageName(project)}</span>
                        {project.manualStageOverride && (
                          <span className="text-xs text-blue-500">*</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <PriorityLight priority={project.priorityLight} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={project.status === 'ACTIVE' ? 'success' : 'default'}
                        size="sm"
                      >
                        {t(`status.${project.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/app/projects/${project.documentId}`)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Открыть"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {/* Архивирование/восстановление - только для Lead/Admin */}
                        {canEdit && (
                          project.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleArchive(project.documentId)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title={t('project.archiveProject')}
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(project.documentId)}
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title={t('project.restoreProject')}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Project Modal */}
      {showCreateModal && (
        <ProjectFormModal
          defaultDepartment={userDepartment}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}
