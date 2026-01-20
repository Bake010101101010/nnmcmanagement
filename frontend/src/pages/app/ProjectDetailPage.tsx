import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Calendar,
  Users,
  Edit,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Trash2,
  MessageSquare,
  AlertTriangle,
  Clock,
  Save,
  X,
  Eye,
} from 'lucide-react';
import { useProjectStore, getProjectStage } from '../../store/projectStore';
import { useAuthStore, useUserRole } from '../../store/authStore';
import { projectsApi } from '../../api/projects';
import { tasksApi } from '../../api/tasks';
import { meetingsApi } from '../../api/meetings';
import type { Task, MeetingNote } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import PriorityLight from '../../components/ui/PriorityLight';
import Loader from '../../components/ui/Loader';
import ProjectFormModal from '../../components/projects/ProjectFormModal';
import TaskModal from '../../components/projects/TaskModal';
import DocumentsSection from '../../components/projects/DocumentsSection';
import SurveySection from '../../components/surveys/SurveySection';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  
  // Получаем детальные права пользователя
  const {
    canEditProject,
    canManageTasks,
    canDeleteTasks,
    canChangeTaskStatus,
    canAddMeetingNotes,
    canManageMeetingNotes,
    canManageDocuments,
    canManageSurveys,
  } = useUserRole();
  
  const { selectedProject: project, stages, isLoading, fetchProject, fetchStages } = useProjectStore();

  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [meetingsOpen, setMeetingsOpen] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Task modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  // Meeting states
  const [newMeetingText, setNewMeetingText] = useState('');
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editingMeetingText, setEditingMeetingText] = useState('');
  
  // Description editing
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchStages();
    }
  }, [id, fetchProject, fetchStages]);

  useEffect(() => {
    if (project?.description) {
      setDescriptionText(project.description);
    }
  }, [project?.description]);

  // === TASK HANDLERS ===
  const handleOpenAddTask = () => {
    setEditingTask(undefined);
    setShowTaskModal(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (data: { title: string; description: string; status: Task['status'] }) => {
    if (!project) return;
    
    if (editingTask) {
      // Update existing task
      await tasksApi.update(editingTask.documentId, {
        title: data.title,
        description: data.description,
        status: data.status,
      });
    } else {
      // Create new task
      await tasksApi.create({
        title: data.title,
        description: data.description,
        project: project.documentId,
        status: 'TODO',
        order: (project.tasks?.length || 0) + 1,
      });
    }
    fetchProject(id!);
  };

  const handleTaskStatusChange = async (task: Task) => {
    if (!canChangeTaskStatus) return;
    
    // Toggle: TODO -> DONE, DONE -> TODO
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    
    try {
      await tasksApi.updateStatus(task.documentId, newStatus);
      fetchProject(id!);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskDocumentId: string) => {
    if (!canDeleteTasks) return;
    try {
      await tasksApi.delete(taskDocumentId);
      fetchProject(id!);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // === DESCRIPTION HANDLERS ===
  const handleSaveDescription = async () => {
    if (!project || !canEditProject) return;
    setIsSavingDescription(true);
    try {
      await projectsApi.update(project.documentId, { description: descriptionText });
      setIsEditingDescription(false);
      fetchProject(id!);
    } catch (error) {
      console.error('Failed to save description:', error);
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleCancelDescriptionEdit = () => {
    setDescriptionText(project?.description || '');
    setIsEditingDescription(false);
  };

  // === MEETING HANDLERS ===
  const handleAddMeeting = async () => {
    if (!newMeetingText.trim() || !project || !canAddMeetingNotes) return;
    setIsAddingMeeting(true);
    try {
      await meetingsApi.create({
        text: newMeetingText,
        project: project.documentId,
        author: user?.id,
      });
      setNewMeetingText('');
      fetchProject(id!);
    } catch (error) {
      console.error('Failed to add meeting:', error);
    } finally {
      setIsAddingMeeting(false);
    }
  };

  const handleEditMeeting = (meeting: MeetingNote) => {
    // Member может редактировать только свои записи
    if (!canManageMeetingNotes && meeting.author?.id !== user?.id) return;
    setEditingMeetingId(meeting.documentId);
    setEditingMeetingText(meeting.text);
  };

  const handleSaveMeeting = async () => {
    if (!editingMeetingId || !editingMeetingText.trim()) return;
    try {
      await meetingsApi.update(editingMeetingId, { text: editingMeetingText });
      setEditingMeetingId(null);
      setEditingMeetingText('');
      fetchProject(id!);
    } catch (error) {
      console.error('Failed to update meeting:', error);
    }
  };

  const handleCancelMeetingEdit = () => {
    setEditingMeetingId(null);
    setEditingMeetingText('');
  };

  const handleDeleteMeeting = async (meetingDocumentId: string) => {
    if (!canManageMeetingNotes) return;
    try {
      await meetingsApi.delete(meetingDocumentId);
      fetchProject(id!);
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  };
  
  // Проверка: может ли пользователь редактировать/удалять конкретную запись
  const canEditMeeting = (meeting: MeetingNote) => {
    return canManageMeetingNotes || meeting.author?.id === user?.id;
  };

  // === HELPERS ===
  const getDepartmentName = () => {
    if (!project?.department) return '';
    return i18n.language === 'kz' ? project.department.name_kz : project.department.name_ru;
  };

  const getStageName = () => {
    if (!project) return '';
    const stage = getProjectStage(project, stages);
    if (!stage) return '';
    return i18n.language === 'kz' ? stage.name_kz : stage.name_ru;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || !project) {
    return <Loader text={t('common.loading')} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('common.back')}
      </button>

      {/* Header */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-display font-bold text-slate-800">
                {project.title}
              </h1>
              <PriorityLight priority={project.priorityLight} size="lg" />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {project.department && (
                <Badge variant={project.department.key === 'IT' ? 'it' : 'digital'}>
                  {getDepartmentName()}
                </Badge>
              )}
              <Badge variant={project.status === 'ACTIVE' ? 'success' : 'default'}>
                {t(`status.${project.status}`)}
              </Badge>
              {project.overdue && (
                <Badge variant="danger">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {t('project.overdue')}
                </Badge>
              )}
              {project.dueSoon && !project.overdue && (
                <Badge variant="warning">
                  <Clock className="w-3 h-3 mr-1" />
                  {t('project.dueSoon')}
                </Badge>
              )}
              {project.manualStageOverride && (
                <Badge variant="info">{t('project.manualStageWarning')}</Badge>
              )}
            </div>
          </div>

          {canEditProject && (
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(true)}
              icon={<Edit className="w-4 h-4" />}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>

        {/* Meta info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-500 mb-1">{t('project.startDate')}</p>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(project.startDate)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">{t('project.dueDate')}</p>
            <p className={`font-medium flex items-center gap-1 ${project.overdue ? 'text-red-600' : ''}`}>
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(project.dueDate)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">{t('project.stage')}</p>
            <p className="font-medium">{getStageName()}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">{t('project.responsible')}</p>
            <p className="font-medium flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" />
              {project.responsibleUsers?.length || 0}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">{t('project.progress')}</span>
            <span className="text-sm font-medium">
              {project.doneTasks}/{project.totalTasks} {t('project.tasks')}
            </span>
          </div>
          <ProgressBar value={project.progressPercent || 0} size="lg" />
        </div>
      </Card>

      {/* Description Accordion */}
      <Card padding="none">
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={() => setDescriptionOpen(!descriptionOpen)}
            className="flex items-center gap-2 flex-1"
          >
            <h2 className="font-semibold text-slate-800">{t('project.description')}</h2>
            {descriptionOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {canEditProject && descriptionOpen && !isEditingDescription && (
            <button
              onClick={() => setIsEditingDescription(true)}
              className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
        {descriptionOpen && (
          <div className="px-4 pb-4 pt-2">
            {isEditingDescription ? (
              <div>
                <textarea
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                  placeholder="Описание проекта (поддерживает Markdown)..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveDescription} loading={isSavingDescription} size="sm" icon={<Save className="w-4 h-4" />}>
                    {t('common.save')}
                  </Button>
                  <Button onClick={handleCancelDescriptionEdit} variant="secondary" size="sm" icon={<X className="w-4 h-4" />}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {project.description ? (
                  <ReactMarkdown>{project.description}</ReactMarkdown>
                ) : (
                  <p className="text-slate-400 italic">Описание отсутствует</p>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Documents Section */}
      <DocumentsSection 
        projectDocumentId={project.documentId} 
        canEdit={canManageDocuments} 
      />

      {/* Tasks Accordion */}
      <Card padding="none">
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={() => setTasksOpen(!tasksOpen)}
            className="flex items-center gap-2 flex-1"
          >
            <h2 className="font-semibold text-slate-800">
              {t('project.tasks')} ({project.tasks?.length || 0})
            </h2>
            {tasksOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {canManageTasks && tasksOpen && (
            <Button onClick={handleOpenAddTask} size="sm" icon={<Plus className="w-4 h-4" />}>
              Добавить
            </Button>
          )}
        </div>
        {tasksOpen && (
          <div className="px-4 pb-4 pt-2">
            {/* Tasks list */}
            <div className="space-y-2">
              {!project.tasks || project.tasks.length === 0 ? (
                <p className="text-slate-400 text-center py-4">{t('task.noTasks')}</p>
              ) : (
                project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors ${
                      task.status === 'DONE' ? 'opacity-60' : ''
                    }`}
                  >
                    <button
                      onClick={() => handleTaskStatusChange(task)}
                      disabled={!canChangeTaskStatus}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                        task.status === 'DONE' 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-slate-300 hover:border-green-400'
                      } ${canChangeTaskStatus ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      title={task.status === 'DONE' ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
                    >
                      {task.status === 'DONE' && <Check className="w-4 h-4 text-white" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <span className={`block ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        task.status === 'DONE' ? 'bg-green-100 text-green-700' : 
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {t(`task.${task.status.toLowerCase()}`)}
                      </span>
                      {/* Просмотр/редактирование - для Lead/Admin */}
                      {canManageTasks && (
                        <button
                          onClick={() => handleOpenEditTask(task)}
                          className="p-1 text-slate-400 hover:text-primary-500 transition-colors"
                          title="Редактировать"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {/* Удаление - только для Lead/Admin */}
                      {canDeleteTasks && (
                        <button
                          onClick={() => handleDeleteTask(task.documentId)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Survey Section */}
      <SurveySection
        projectDocumentId={project.documentId}
        projectTitle={project.title}
        projectProgress={project.progressPercent || 0}
        canEdit={canManageSurveys}
      />

      {/* Meetings Accordion */}
      <Card padding="none">
        <button
          onClick={() => setMeetingsOpen(!meetingsOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t('project.meetings')} ({project.meetings?.length || 0})
          </h2>
          {meetingsOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {meetingsOpen && (
          <div className="px-4 pb-4">
            {/* Add meeting form - доступно всем пользователям */}
            {canAddMeetingNotes && (
              <div className="mb-4">
                <textarea
                  placeholder={t('meeting.addNote')}
                  value={newMeetingText}
                  onChange={(e) => setNewMeetingText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                />
                <Button onClick={handleAddMeeting} loading={isAddingMeeting} size="sm">
                  {t('meeting.addNote')}
                </Button>
              </div>
            )}

            {/* Meetings list */}
            <div className="space-y-3">
              {!project.meetings || project.meetings.length === 0 ? (
                <p className="text-slate-400 text-center py-4">{t('meeting.noNotes')}</p>
              ) : (
                project.meetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-xs text-slate-500">
                        <span className="font-medium">
                          {meeting.author?.firstName || meeting.author?.username || 'Аноним'}
                        </span>
                        {' • '}
                        {formatDateTime(meeting.createdAt)}
                      </div>
                      {editingMeetingId !== meeting.documentId && (
                        <div className="flex gap-1">
                          {/* Редактирование - свои записи для всех, все записи для Lead/Admin */}
                          {canEditMeeting(meeting) && (
                            <button
                              onClick={() => handleEditMeeting(meeting)}
                              className="p-1 text-slate-400 hover:text-primary-500 transition-colors"
                              title="Редактировать"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                          {/* Удаление - только для Lead/Admin */}
                          {canManageMeetingNotes && (
                            <button
                              onClick={() => handleDeleteMeeting(meeting.documentId)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {editingMeetingId === meeting.documentId ? (
                      <div>
                        <textarea
                          value={editingMeetingText}
                          onChange={(e) => setEditingMeetingText(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleSaveMeeting} size="sm" icon={<Save className="w-3 h-3" />}>
                            {t('common.save')}
                          </Button>
                          <Button onClick={handleCancelMeetingEdit} variant="secondary" size="sm" icon={<X className="w-3 h-3" />}>
                            {t('common.cancel')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{meeting.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Edit Project Modal */}
      {showEditModal && (
        <ProjectFormModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchProject(id!);
          }}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
}
