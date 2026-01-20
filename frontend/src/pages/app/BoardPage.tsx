import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Plus, AlertCircle, Building2, AlertTriangle } from 'lucide-react';
import { useProjectStore, getProjectStage } from '../../store/projectStore';
import { useUserRole } from '../../store/authStore';
import { projectsApi } from '../../api/projects';
import type { Project, BoardStage } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import ProjectCard from '../../components/projects/ProjectCard';
import KanbanColumn from '../../components/projects/KanbanColumn';
import ProjectFormModal from '../../components/projects/ProjectFormModal';

export default function BoardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { departmentKey, userDepartment, isAdmin, canDragProjects, canEditProject } = useUserRole();
  const {
    projects,
    stages,
    departments,
    isLoading,
    fetchProjects,
    fetchStages,
    fetchDepartments,
    updateProjectLocally,
  } = useProjectStore();

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deptFilter, setDeptFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  
  // Модальное окно предупреждения
  const [warningModal, setWarningModal] = useState<{
    show: boolean;
    message: string;
    project?: Project;
    targetStage?: BoardStage;
  }>({ show: false, message: '' });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchStages();
    fetchDepartments();
  }, [fetchStages, fetchDepartments]);

  useEffect(() => {
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
    
    if (!showArchived) {
      filters.status = 'ACTIVE';
    }
    
    fetchProjects(filters);
  }, [departmentKey, deptFilter, showArchived, isAdmin, fetchProjects]);

  // Фильтрация по приоритету на клиенте
  const filteredProjects = projects.filter((project) => {
    if (priorityFilter && project.priorityLight !== priorityFilter) return false;
    return true;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const project = filteredProjects.find((p) => p.documentId === event.active.id);
    setActiveProject(project || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    // Только Lead/Admin могут перетаскивать проекты
    if (!canDragProjects) return;
    if (!over) return;

    const projectDocumentId = active.id as string;
    const targetStageId = over.id as number;

    const project = filteredProjects.find((p) => p.documentId === projectDocumentId);
    if (!project) return;

    const currentStage = getProjectStage(project, stages);
    const targetStage = stages.find((s) => s.id === targetStageId);
    
    if (!targetStage || currentStage?.id === targetStageId) return;

    const progress = project.progressPercent || 0;

    // Проверка: можно ли переместить в эту стадию?
    // Если прогресс не соответствует целевой стадии - показываем предупреждение
    if (progress < targetStage.minPercent || progress >= targetStage.maxPercent) {
      setWarningModal({
        show: true,
        message: `Прогресс проекта (${progress}%) не соответствует стадии "${i18n.language === 'kz' ? targetStage.name_kz : targetStage.name_ru}" (${targetStage.minPercent}%-${targetStage.maxPercent}%). Вы уверены, что хотите переместить вручную?`,
        project,
        targetStage,
      });
      return;
    }

    // Если прогресс соответствует - перемещаем сразу
    await moveProject(projectDocumentId, targetStageId);
  };

  const moveProject = async (projectDocumentId: string, targetStageId: number) => {
    try {
      await projectsApi.updateStage(projectDocumentId, targetStageId);
      updateProjectLocally(projectDocumentId, { 
        manualStageOverride: stages.find((s) => s.id === targetStageId) 
      });
    } catch (error) {
      console.error('Failed to update stage:', error);
    }
  };

  const handleConfirmMove = async () => {
    if (warningModal.project && warningModal.targetStage) {
      await moveProject(warningModal.project.documentId, warningModal.targetStage.id);
    }
    setWarningModal({ show: false, message: '' });
  };

  const getProjectsForStage = (stageId: number) => {
    return filteredProjects.filter((project) => {
      const stage = getProjectStage(project, stages);
      return stage?.id === stageId;
    });
  };

  const getStageName = (stage: { name_ru: string; name_kz: string }) => {
    return i18n.language === 'kz' ? stage.name_kz : stage.name_ru;
  };

  const getDepartmentName = () => {
    if (!userDepartment) return 'Все отделы';
    return i18n.language === 'kz' ? userDepartment.name_kz : userDepartment.name_ru;
  };

  // Только SuperAdmin может фильтровать по отделам
  const canFilterByDept = isAdmin;

  const departmentOptions = [
    { value: '', label: 'Все отделы' },
    ...departments.map((d) => ({
      value: d.key,
      label: i18n.language === 'kz' ? d.name_kz : d.name_ru,
    })),
  ];

  const priorityOptions = [
    { value: '', label: 'Все приоритеты' },
    { value: 'RED', label: t('priority.RED') },
    { value: 'YELLOW', label: t('priority.YELLOW') },
    { value: 'GREEN', label: t('priority.GREEN') },
  ];

  if (isLoading && projects.length === 0) {
    return <Loader text={t('common.loading')} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">
            {t('board.title')}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-slate-400" />
            {isAdmin ? (
              <span className="text-slate-500">SuperAdmin • Все отделы</span>
            ) : (
              <Badge variant={userDepartment?.key === 'IT' ? 'it' : userDepartment?.key === 'DIGITALIZATION' ? 'digital' : 'default'}>
                {getDepartmentName()}
              </Badge>
            )}
          </div>
        </div>
        {canEditProject && (
          <Button onClick={() => setShowCreateModal(true)} icon={<Plus className="w-4 h-4" />}>
            {t('project.createProject')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          {canFilterByDept && (
            <div className="w-48">
              <Select
                options={departmentOptions}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              />
            </div>
          )}
          
          <div className="w-48">
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600">Показать завершённые</span>
          </label>
          
          <div className="ml-auto text-sm text-slate-500">
            {filteredProjects.length} проект(ов)
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max h-full">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                stageName={getStageName(stage)}
                projects={getProjectsForStage(stage.id)}
                onProjectClick={(documentId) => navigate(`/app/projects/${documentId}`)}
                canDrag={canDragProjects}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeProject ? (
            <div className="rotate-3 scale-105">
              <ProjectCard project={activeProject} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Warning Modal */}
      <Modal
        isOpen={warningModal.show}
        onClose={() => setWarningModal({ show: false, message: '' })}
        title="Предупреждение"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800">{warningModal.message}</p>
          </div>
          <p className="text-sm text-slate-500">
            При ручном перемещении проект будет помечен как "установлено вручную".
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setWarningModal({ show: false, message: '' })}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleConfirmMove}>
              Переместить
            </Button>
          </div>
        </div>
      </Modal>

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
