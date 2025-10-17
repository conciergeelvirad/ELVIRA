import { Users, CheckSquare, Calendar, UserX, Plus } from "lucide-react";
import { TabPage, type TabConfig } from "../../components/common";
import { StaffScheduleCalendar } from "./components/staff/calendar/StaffScheduleCalendar";
import { useHotelStaffWithPersonalData } from "../../hooks/queries/hotel-management/staff";
import { useTasks } from "../../hooks/queries/hotel-management/tasks";
import { useAbsenceRequests } from "../../hooks/queries/hotel-management/absence-requests";
import { useHotelStaff } from "../../hooks/hotel/useHotelStaff";
import {
  StaffDataView,
  TasksDataView,
  AbsenceRequestsDataView,
  StaffDetail,
  TaskDetail,
  AbsenceRequestDetail,
  StaffForm,
  TaskForm,
  STAFF_FORM_FIELDS,
  getTaskFormFields,
  getAbsenceRequestFormFields,
} from "./components/staff";
import { useStaffCRUD, useTasksCRUD, useAbsenceRequestsCRUD } from "./hooks";
import { setHotelId } from "./hooks/useCRUDWithMutations";
import { CRUDTabContent } from "./components/CRUDTabContent";
import { useMemo, useEffect } from "react";

export const HotelStaffPage = () => {
  const hotelStaff = useHotelStaff();
  const { hotelId } = hotelStaff;

  // Set hotel ID for CRUD operations
  useEffect(() => {
    if (hotelId) {
      setHotelId(hotelId);
    }
  }, [hotelId]);

  // Fetch data
  const { data: staffMembers = [], isLoading } =
    useHotelStaffWithPersonalData();

  const { data: tasks = [], isLoading: tasksLoading } = useTasks(hotelId || "");
  const { data: absenceRequests = [], isLoading: absenceLoading } =
    useAbsenceRequests(hotelId || "");

  // Check if user is admin or manager
  const isAdminOrManager = useMemo(() => {
    const staff = hotelStaff.hotelStaff;
    return (
      staff?.position === "Hotel Admin" ||
      (staff?.position === "Hotel Staff" && staff?.department === "Manager") ||
      false
    );
  }, [hotelStaff.hotelStaff]);

  // Create staff options for task and absence request forms
  const staffOptions = useMemo(() => {
    return staffMembers.map((staff) => ({
      value: staff.id,
      label: `${staff.name} (${staff.employeeId})`,
    }));
  }, [staffMembers]);

  // Create task form fields with staff options
  const taskFormFields = useMemo(() => {
    return getTaskFormFields(staffOptions);
  }, [staffOptions]);

  // Create absence request form fields with staff options and role-based restrictions
  const absenceFormFields = useMemo(() => {
    const currentStaff = hotelStaff.hotelStaff;

    const restrictedStaffOptions = isAdminOrManager
      ? staffOptions
      : currentStaff
      ? [
          {
            value: currentStaff.id,
            label: `${currentStaff.name} (${currentStaff.employeeId})`,
          },
        ]
      : [];

    return getAbsenceRequestFormFields(
      restrictedStaffOptions,
      isAdminOrManager,
      currentStaff?.id
    );
  }, [staffOptions, isAdminOrManager, hotelStaff.hotelStaff]);

  // CRUD hooks
  const staffCRUD = useStaffCRUD({
    initialStaff: staffMembers,
    formFields: STAFF_FORM_FIELDS,
  });

  const tasksCRUD = useTasksCRUD({
    initialTasks: tasks,
    formFields: taskFormFields,
  });

  const absenceRequestsCRUD = useAbsenceRequestsCRUD({
    initialRequests: absenceRequests,
    formFields: absenceFormFields,
  });

  const staffManagementContent = (
    <CRUDTabContent
      searchTerm={staffCRUD.searchAndFilter.searchTerm}
      onSearchChange={staffCRUD.searchAndFilter.setSearchTerm}
      searchPlaceholder="Search staff members..."
      filterActive={Boolean(staffCRUD.searchAndFilter.filterValue)}
      onFilterToggle={() =>
        staffCRUD.searchAndFilter.setFilterValue(
          staffCRUD.searchAndFilter.filterValue ? "" : "active"
        )
      }
      viewMode={staffCRUD.searchAndFilter.mode}
      onViewModeChange={staffCRUD.searchAndFilter.setViewMode}
      isLoading={isLoading}
      filteredData={staffCRUD.searchAndFilter.filteredData}
      emptyMessage="No staff members found."
      // Only show add button for admin/manager
      addButtonLabel={isAdminOrManager ? "Add Staff Member" : ""}
      addButtonIcon={isAdminOrManager ? Plus : undefined}
      onAddClick={() => {
        if (isAdminOrManager) {
          staffCRUD.modalActions.openCreateModal();
        }
      }}
      DataViewComponent={StaffDataView}
      dataViewProps={{
        currentUserId: hotelStaff.hotelStaff?.id,
        isAdminOrManager: isAdminOrManager,
      }}
      // Regular staff can only view details
      onRowClick={(staff) => staffCRUD.modalActions.openDetailModal(staff)}
      onEdit={
        // Admin/Manager can edit anyone, Hotel Staff can edit only their own profile
        isAdminOrManager
          ? (staff) => {
              console.log(
                "👤 [HotelStaffPage] Admin/Manager editing staff:",
                staff.id
              );
              staffCRUD.modalActions.openEditModal(staff);
            }
          : (staff) => {
              // Allow Hotel Staff to edit only their own profile
              if (staff.id === hotelStaff.hotelStaff?.id) {
                console.log(
                  "👤 [HotelStaffPage] Hotel Staff editing own profile:",
                  staff.id
                );
                staffCRUD.modalActions.openEditModal(staff);
              } else {
                console.log(
                  "🚫 [HotelStaffPage] Hotel Staff cannot edit other profiles"
                );
              }
            }
      }
      onDelete={
        isAdminOrManager
          ? (staff) => staffCRUD.modalActions.openDeleteModal(staff)
          : () => {}
      }
      modalState={staffCRUD.modalState}
      modalActions={staffCRUD.modalActions}
      formState={staffCRUD.formState}
      formActions={staffCRUD.formActions}
      formFields={STAFF_FORM_FIELDS}
      onCreateSubmit={
        isAdminOrManager ? staffCRUD.handleCreateSubmit : async () => {}
      }
      onEditSubmit={
        // Both Admin/Manager and Hotel Staff can submit edits
        // The form will handle field restrictions
        async () => {
          console.log("💾 [HotelStaffPage] Edit submit triggered");
          console.log(
            "👤 [HotelStaffPage] Current user:",
            hotelStaff.hotelStaff?.position
          );
          await staffCRUD.handleEditSubmit();
        }
      }
      onDeleteConfirm={
        isAdminOrManager ? staffCRUD.handleDeleteConfirm : () => {}
      }
      entityName="Staff Member"
      renderDetailContent={(item) => <StaffDetail item={item} />}
      detailModalActions={{
        // Admin/Manager can always edit and delete
        // Hotel Staff can only edit their own profile (delete not allowed)
        showEdit:
          isAdminOrManager ||
          staffCRUD.modalState.itemToView?.id === hotelStaff.hotelStaff?.id,
        showDelete: isAdminOrManager,
      }}
      customFormComponent={StaffForm}
      customFormProps={{
        currentUserPosition: hotelStaff.hotelStaff?.position,
      }}
    />
  );

  const taskAssignmentContent = (
    <CRUDTabContent
      searchTerm={tasksCRUD.searchAndFilter.searchTerm}
      onSearchChange={tasksCRUD.searchAndFilter.setSearchTerm}
      searchPlaceholder="Search tasks..."
      filterActive={Boolean(tasksCRUD.searchAndFilter.filterValue)}
      onFilterToggle={() =>
        tasksCRUD.searchAndFilter.setFilterValue(
          tasksCRUD.searchAndFilter.filterValue ? "" : "PENDING"
        )
      }
      viewMode={tasksCRUD.searchAndFilter.mode}
      onViewModeChange={tasksCRUD.searchAndFilter.setViewMode}
      isLoading={tasksLoading}
      filteredData={
        isAdminOrManager
          ? tasksCRUD.searchAndFilter.filteredData
          : tasksCRUD.searchAndFilter.filteredData.filter(
              (task) => task.staffId === hotelStaff.hotelStaff?.id
            )
      }
      emptyMessage={
        isAdminOrManager ? "No tasks found." : "No tasks assigned to you."
      }
      addButtonLabel={isAdminOrManager ? "Add Task" : ""}
      addButtonIcon={isAdminOrManager ? Plus : undefined}
      onAddClick={() => {
        if (isAdminOrManager) {
          tasksCRUD.modalActions.openCreateModal();
        }
      }}
      DataViewComponent={TasksDataView}
      onRowClick={(task) => tasksCRUD.modalActions.openDetailModal(task)}
      onEdit={
        // Admin/Manager can edit any task, Hotel Staff can edit their assigned tasks
        isAdminOrManager
          ? (task) => {
              console.log(
                "👤 [HotelStaffPage] Admin/Manager editing task:",
                task.id
              );
              tasksCRUD.modalActions.openEditModal(task);
            }
          : (task) => {
              // Allow Hotel Staff to edit only their assigned tasks
              if (task.staffId === hotelStaff.hotelStaff?.id) {
                console.log(
                  "👤 [HotelStaffPage] Hotel Staff editing assigned task:",
                  task.id
                );
                tasksCRUD.modalActions.openEditModal(task);
              } else {
                console.log(
                  "🚫 [HotelStaffPage] Hotel Staff cannot edit unassigned tasks"
                );
              }
            }
      }
      onDelete={
        isAdminOrManager
          ? (task) => tasksCRUD.modalActions.openDeleteModal(task)
          : undefined
      }
      modalState={tasksCRUD.modalState}
      modalActions={tasksCRUD.modalActions}
      formState={tasksCRUD.formState}
      formActions={tasksCRUD.formActions}
      formFields={taskFormFields}
      onCreateSubmit={
        isAdminOrManager ? tasksCRUD.handleCreateSubmit : undefined
      }
      onEditSubmit={
        // Both Admin/Manager and Hotel Staff can submit edits
        // The form will handle field restrictions
        async () => {
          console.log("💾 [HotelStaffPage] Task edit submit triggered");
          console.log(
            "👤 [HotelStaffPage] Current user:",
            hotelStaff.hotelStaff?.position
          );
          await tasksCRUD.handleEditSubmit();
        }
      }
      onDeleteConfirm={
        isAdminOrManager ? tasksCRUD.handleDeleteConfirm : undefined
      }
      entityName="Task"
      renderDetailContent={(item) => <TaskDetail item={item} />}
      detailModalActions={{
        // Admin/Manager can always edit and delete
        // Hotel Staff can only edit their assigned tasks (delete not allowed)
        showEdit:
          isAdminOrManager ||
          tasksCRUD.modalState.itemToView?.staffId ===
            hotelStaff.hotelStaff?.id,
        showDelete: isAdminOrManager,
      }}
      customFormComponent={TaskForm}
      customFormProps={{
        currentUserPosition: hotelStaff.hotelStaff?.position,
        taskFormFields: taskFormFields,
      }}
    />
  );

  // Get current staff ID for filtering
  const currentStaffId = hotelStaff.hotelStaff?.id;

  // Filter absence requests - admins/managers see all, staff see only their own
  const filteredAbsenceRequests = isAdminOrManager
    ? absenceRequestsCRUD.searchAndFilter.filteredData
    : absenceRequestsCRUD.searchAndFilter.filteredData.filter(
        (request) => request.staffId === currentStaffId
      );

  const absenceContent = (
    <CRUDTabContent
      searchTerm={absenceRequestsCRUD.searchAndFilter.searchTerm}
      onSearchChange={absenceRequestsCRUD.searchAndFilter.setSearchTerm}
      searchPlaceholder="Search absence requests..."
      filterActive={Boolean(absenceRequestsCRUD.searchAndFilter.filterValue)}
      onFilterToggle={() =>
        absenceRequestsCRUD.searchAndFilter.setFilterValue(
          absenceRequestsCRUD.searchAndFilter.filterValue ? "" : "pending"
        )
      }
      viewMode={absenceRequestsCRUD.searchAndFilter.mode}
      onViewModeChange={absenceRequestsCRUD.searchAndFilter.setViewMode}
      isLoading={absenceLoading}
      filteredData={filteredAbsenceRequests}
      emptyMessage={
        isAdminOrManager
          ? "No absence requests found."
          : "You have no absence requests. Add a new request."
      }
      addButtonLabel="Add Absence Request"
      addButtonIcon={Plus}
      onAddClick={() => absenceRequestsCRUD.modalActions.openCreateModal()}
      DataViewComponent={AbsenceRequestsDataView}
      onRowClick={(request) =>
        absenceRequestsCRUD.modalActions.openDetailModal(request)
      }
      onEdit={(request) =>
        isAdminOrManager || request.staffId === currentStaffId
          ? absenceRequestsCRUD.modalActions.openEditModal(request)
          : undefined
      }
      onDelete={(request) =>
        isAdminOrManager || request.staffId === currentStaffId
          ? absenceRequestsCRUD.modalActions.openDeleteModal(request)
          : undefined
      }
      modalState={absenceRequestsCRUD.modalState}
      modalActions={absenceRequestsCRUD.modalActions}
      formState={absenceRequestsCRUD.formState}
      formActions={absenceRequestsCRUD.formActions}
      formFields={absenceFormFields}
      onCreateSubmit={absenceRequestsCRUD.handleCreateSubmit}
      onEditSubmit={absenceRequestsCRUD.handleEditSubmit}
      onDeleteConfirm={absenceRequestsCRUD.handleDeleteConfirm}
      entityName="Absence Request"
      renderDetailContent={(item) => <AbsenceRequestDetail item={item} />}
    />
  );

  const tabs: TabConfig[] = [
    {
      id: "staff-management",
      label: "Staff Management",
      icon: Users,
      content: staffManagementContent,
    },
    {
      id: "task-assignment",
      label: "Task Assignment",
      icon: CheckSquare,
      content: taskAssignmentContent,
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
      content: <StaffScheduleCalendar />,
    },
    {
      id: "absence",
      label: "Absence",
      icon: UserX,
      content: absenceContent,
    },
  ];

  return (
    <TabPage title="Hotel Staff" tabs={tabs} defaultTab="staff-management" />
  );
};
