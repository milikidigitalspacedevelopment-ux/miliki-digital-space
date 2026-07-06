import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  Pencil,
  Trash2,
  Eye,
  GraduationCap,
} from "lucide-react";
import courseService from "../../services/courseService";
import programService from "../../services/programService";
import api from "../../services/api";

const emptyForm = {
  program_id: "",
  category_id: "",
  instructor_id: "",
  title: "",
  short_description: "",
  description: "",
  overview: "",
  objectives: "",
  syllabus: "",
  weekly_schedule: "",
  final_outcome: "",
  level: "beginner",
  duration_months: "",
  duration_weeks: "",
  delivery_mode: "Physical",
  class_schedule: "",
  tuition_fee: "",
  registration_fee: "",
  next_intake: "",
  language: "English",
  status: "draft",
  featured: false,
  image_url: "",
};

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [editingRequirementId, setEditingRequirementId] = useState(null);
  const [editingRequirementText, setEditingRequirementText] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [newLearningOutcome, setNewLearningOutcome] = useState("");
  const [editingOutcomeId, setEditingOutcomeId] = useState(null);
  const [editingOutcomeText, setEditingOutcomeText] = useState("");
  const [careerOpportunities, setCareerOpportunities] = useState([]);
  const [newCareerOpportunity, setNewCareerOpportunity] = useState("");
  const [editingOpportunityId, setEditingOpportunityId] = useState(null);
  const [editingOpportunityText, setEditingOpportunityText] = useState("");
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load courses right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [programData, categoryData, userData] = await Promise.all([
          programService.getPrograms(),
          api.get("/categories").then((res) => res.data?.data || []),
          api.get("/users").then((res) => res.data?.data || []),
        ]);

        setPrograms(Array.isArray(programData) ? programData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setInstructors(Array.isArray(userData) ? userData.filter((user) => user?.role !== "admin") : []);
      } catch (err) {
        console.error(err);
      }
    };

    loadLookups();
  }, []);

  const getCourseStatus = (course) => course.status || "Draft";
  const getCourseLevel = (course) => course.level || "beginner";
  const getCourseDurationParts = (course) => {
    const weeks = Number(course.duration_weeks ?? course.duration_weeks_remaining ?? 0);
    return { weeks };
  };

  const getCourseDuration = (course) => {
    const { weeks } = getCourseDurationParts(course);
    return weeks > 0 ? `${weeks} week${weeks > 1 ? "s" : ""}` : "—";
  };
  const getCourseInstructor = (course) => course.instructor_name || "—";
  const getCourseCategory = (course) => course.category_name || "—";

  const statuses = useMemo(() => ["", ...Array.from(new Set(courses.map(getCourseStatus).filter(Boolean)))], [courses]);
  const levels = useMemo(() => ["", ...Array.from(new Set(courses.map(getCourseLevel).filter(Boolean)))], [courses]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return courses
      .filter((course) => {
        const matchesSearch =
          !term ||
          (course.title || "").toLowerCase().includes(term) ||
          (course.description || "").toLowerCase().includes(term) ||
          String(course.id).includes(term);
        const matchesStatus = !statusFilter || getCourseStatus(course) === statusFilter;
        const matchesLevel = !levelFilter || getCourseLevel(course) === levelFilter;

        return matchesSearch && matchesStatus && matchesLevel;
      })
      .sort((a, b) => b.id - a.id);
  }, [courses, searchTerm, statusFilter, levelFilter]);

  const total = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pagedCourses = filteredCourses.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const active = courses.filter((course) => ["published", "active"].includes((course.status || "").toLowerCase())).length;
    const totalDurationWeeks = courses.reduce((sum, course) => {
      const { weeks } = getCourseDurationParts(course);
      return sum + weeks;
    }, 0);
    return { totalCourses, active, totalDurationWeeks };
  }, [courses]);

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedCourse(null);
    setForm(emptyForm);
    setError(null);
    setSuccessMessage("");
    setRequirements([]);
    setNewRequirement("");
    setEditingRequirementId(null);
    setEditingRequirementText("");
    setLearningOutcomes([]);
    setNewLearningOutcome("");
    setEditingOutcomeId(null);
    setEditingOutcomeText("");
    setCareerOpportunities([]);
    setNewCareerOpportunity("");
    setEditingOpportunityId(null);
    setEditingOpportunityText("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCourse(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = async (course) => {
    try {
      // Fetch full course data to get all fields including description, overview, objectives, etc.
      const fullCourse = await courseService.getCourseById(course.id);
      
      setModalMode("edit");
      setSelectedCourse(fullCourse);
      setForm({
        program_id: fullCourse.program_id ?? "",
        category_id: fullCourse.category_id ?? "",
        instructor_id: fullCourse.instructor_id ?? "",
        title: fullCourse.title ?? "",
        short_description: fullCourse.short_description ?? "",
        description: fullCourse.description ?? "",
        overview: fullCourse.overview ?? "",
        objectives: fullCourse.objectives ?? "",
        syllabus: fullCourse.syllabus ?? "",
        weekly_schedule: fullCourse.weekly_schedule ?? "",
        final_outcome: fullCourse.final_outcome ?? "",
        level: fullCourse.level ?? "beginner",
        duration_months: fullCourse.duration_months ?? "",
        duration_weeks: fullCourse.duration_weeks ?? fullCourse.duration_weeks_remaining ?? "",
        delivery_mode: fullCourse.delivery_mode ?? "",
        class_schedule: fullCourse.class_schedule ?? "",
        tuition_fee: fullCourse.tuition_fee ?? "",
        registration_fee: fullCourse.registration_fee ?? "",
        next_intake: fullCourse.next_intake ?? "",
        language: fullCourse.language ?? "English",
        status: fullCourse.status ?? "draft",
        featured: Boolean(fullCourse.featured),
        image_url: fullCourse.image_url ?? "",
      });
      setRequirements(fullCourse.requirements || []);
      setLearningOutcomes(fullCourse.learning_outcomes || []);
      setCareerOpportunities(fullCourse.career_opportunities || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load course details.");
    }
  };

  const openViewModal = async (course) => {
    try {
      // Fetch full course data to get all fields
      const fullCourse = await courseService.getCourseById(course.id);
      
      setModalMode("view");
      setSelectedCourse(fullCourse);
      setForm({
        program_id: fullCourse.program_id ?? "",
        category_id: fullCourse.category_id ?? "",
        instructor_id: fullCourse.instructor_id ?? "",
        title: fullCourse.title ?? "",
        short_description: fullCourse.short_description ?? "",
        description: fullCourse.description ?? "",
        overview: fullCourse.overview ?? "",
        objectives: fullCourse.objectives ?? "",
        syllabus: fullCourse.syllabus ?? "",
        weekly_schedule: fullCourse.weekly_schedule ?? "",
        final_outcome: fullCourse.final_outcome ?? "",
        level: fullCourse.level ?? "beginner",
        duration_months: fullCourse.duration_months ?? "",
        duration_weeks: fullCourse.duration_weeks ?? fullCourse.duration_weeks_remaining ?? "",
        delivery_mode: fullCourse.delivery_mode ?? "",
        class_schedule: fullCourse.class_schedule ?? "",
        tuition_fee: fullCourse.tuition_fee ?? "",
        registration_fee: fullCourse.registration_fee ?? "",
        next_intake: fullCourse.next_intake ?? "",
        language: fullCourse.language ?? "English",
        status: fullCourse.status ?? "draft",
        featured: Boolean(fullCourse.featured),
        image_url: fullCourse.image_url ?? "",
      });
      setRequirements(fullCourse.requirements || []);
      setLearningOutcomes(fullCourse.learning_outcomes || []);
      setCareerOpportunities(fullCourse.career_opportunities || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load course details.");
    }
  };

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await courseService.uploadCourseImage(file);
      const uploadedUrl = response?.url || response?.secure_url || response?.data?.url || "";
      setForm((prev) => ({ ...prev, image_url: uploadedUrl }));
      setSuccessMessage("Image uploaded successfully.");
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        program_id: form.program_id || null,
        category_id: form.category_id || null,
        instructor_id: form.instructor_id || null,
        title: form.title.trim(),
        short_description: form.short_description.trim() || null,
        description: form.description.trim() || null,
        overview: form.overview.trim() || null,
        objectives: form.objectives.trim() || null,
        syllabus: form.syllabus.trim() || null,
        weekly_schedule: form.weekly_schedule.trim() || null,
        final_outcome: form.final_outcome.trim() || null,
        level: form.level,
        duration_months: null,
        duration_weeks: form.duration_weeks === "" ? null : Number(form.duration_weeks),
        delivery_mode: form.delivery_mode || null,
        class_schedule: form.class_schedule.trim() || null,
        tuition_fee: form.tuition_fee === "" ? null : Number(form.tuition_fee),
        registration_fee: form.registration_fee === "" ? null : Number(form.registration_fee),
        next_intake: form.next_intake || null,
        language: form.language || "English",
        status: form.status,
        featured: Boolean(form.featured),
        image_url: form.image_url || null,
        requirements: requirements.map(req => ({
          type: req.type || "requirement",
          content: req.content || req.requirement,
        })),
        learning_outcomes: learningOutcomes.map(outcome => ({
          type: outcome.type || "learning_outcome",
          content: outcome.content,
        })),
        career_opportunities: careerOpportunities.map(opp => ({
          type: opp.type || "career_opportunity",
          content: opp.content,
        })),
      };

      if (modalMode === "edit" && selectedCourse?.id) {
        const updated = await courseService.updateCourse(selectedCourse.id, payload);
        setCourses((prev) => prev.map((course) => (course.id === updated.id ? updated : course)));
        setSuccessMessage("Course updated successfully.");
      } else {
        const created = await courseService.createCourse(payload);
        setCourses((prev) => [created, ...prev]);
        setSuccessMessage("Course created successfully.");
      }

      resetModal();
      await loadCourses();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save course.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await courseService.deleteCourse(id);
      setCourses((prev) => prev.filter((course) => course.id !== id));
      setSuccessMessage("Course deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete course.");
    }
  };

  const handleAddRequirement = async () => {
    if (!newRequirement.trim()) return;

    // For existing courses, make API call first
    if (selectedCourse?.id) {
      try {
        const newReq = await courseService.addCourseRequirement(
          selectedCourse.id,
          {
            type: "requirement",
            content: newRequirement.trim(),
          }
        );
        setRequirements((prev) => [...prev, newReq]);
        setNewRequirement("");
        setSuccessMessage("Requirement added successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to add requirement.");
      }
    } else {
      // For new courses, just update state
      setRequirements((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "requirement",
          content: newRequirement.trim(),
        },
      ]);
      setNewRequirement("");
    }
  };

  const handleUpdateRequirement = async (requirementId) => {
    if (!editingRequirementText.trim()) return;

    // For existing courses, make API call. For new courses, just update state.
    if (selectedCourse?.id) {
      try {
        await courseService.updateCourseRequirement(selectedCourse.id, requirementId, editingRequirementText.trim());
        setRequirements((prev) =>
          prev.map((req) => (req.id === requirementId ? { ...req, requirement: editingRequirementText.trim(), content: editingRequirementText.trim() } : req))
        );
        setEditingRequirementId(null);
        setEditingRequirementText("");
        setSuccessMessage("Requirement updated successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to update requirement.");
      }
    } else {
      // For new courses, just update state
      setRequirements((prev) =>
        prev.map((req) => (req.id === requirementId ? { ...req, content: editingRequirementText.trim() } : req))
      );
      setEditingRequirementId(null);
      setEditingRequirementText("");
    }
  };

  const handleDeleteRequirement = async (requirementId) => {
    if (!window.confirm("Delete this requirement?")) return;

    // For existing courses, make API call. For new courses, just update state.
    if (selectedCourse?.id) {
      try {
        await courseService.deleteCourseRequirement(selectedCourse.id, requirementId);
        setRequirements((prev) => prev.filter((req) => req.id !== requirementId));
        setSuccessMessage("Requirement deleted successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to delete requirement.");
      }
    } else {
      // For new courses, just update state
      setRequirements((prev) => prev.filter((req) => req.id !== requirementId));
    }
  };

  const startEditingRequirement = (requirement) => {
    setEditingRequirementId(requirement.id);
    setEditingRequirementText(requirement.content || requirement.requirement || "");
  };

  const handleAddLearningOutcome = async () => {
    if (!newLearningOutcome.trim()) return;

    // For existing courses, make API call first
    if (selectedCourse?.id) {
      try {
        const newOutcome = await courseService.addCourseRequirement(
          selectedCourse.id,
          {
            type: "learning_outcome",
            content: newLearningOutcome.trim(),
          }
        );
        setLearningOutcomes((prev) => [...prev, newOutcome]);
        setNewLearningOutcome("");
        setSuccessMessage("Learning outcome added successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to add learning outcome.");
      }
    } else {
      // For new courses, just update state
      setLearningOutcomes((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "learning_outcome",
          content: newLearningOutcome.trim(),
        },
      ]);
      setNewLearningOutcome("");
    }
  };

  const handleUpdateLearningOutcome = async (outcomeId) => {
    if (!editingOutcomeText.trim()) return;

    // For existing courses, make API call. For new courses, just update state.
    if (selectedCourse?.id) {
      try {
        await courseService.updateCourseRequirement(selectedCourse.id, outcomeId, editingOutcomeText.trim());
        setLearningOutcomes((prev) =>
          prev.map((outcome) => (outcome.id === outcomeId ? { ...outcome, content: editingOutcomeText.trim() } : outcome))
        );
        setEditingOutcomeId(null);
        setEditingOutcomeText("");
        setSuccessMessage("Learning outcome updated successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to update learning outcome.");
      }
    } else {
      // For new courses, just update state
      setLearningOutcomes((prev) =>
        prev.map((outcome) => (outcome.id === outcomeId ? { ...outcome, content: editingOutcomeText.trim() } : outcome))
      );
      setEditingOutcomeId(null);
      setEditingOutcomeText("");
    }
  };

  const handleDeleteLearningOutcome = async (outcomeId) => {
    if (!window.confirm("Delete this learning outcome?")) return;

    // For existing courses, make API call. For new courses, just update state.
    if (selectedCourse?.id) {
      try {
        await courseService.deleteCourseRequirement(selectedCourse.id, outcomeId);
        setLearningOutcomes((prev) => prev.filter((outcome) => outcome.id !== outcomeId));
        setSuccessMessage("Learning outcome deleted successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to delete learning outcome.");
      }
    } else {
      // For new courses, just update state
      setLearningOutcomes((prev) => prev.filter((outcome) => outcome.id !== outcomeId));
    }
  };

  const startEditingLearningOutcome = (outcome) => {
    setEditingOutcomeId(outcome.id);
    setEditingOutcomeText(outcome.content || "");
  };

  const handleAddCareerOpportunity = async () => {
    if (!newCareerOpportunity.trim()) return;

    // For existing courses, make API call first
    if (selectedCourse?.id) {
      try {
        const newOpp = await courseService.addCourseRequirement(
          selectedCourse.id,
          {
            type: "career_opportunity",
            content: newCareerOpportunity.trim(),
          }
        );
        setCareerOpportunities((prev) => [...prev, newOpp]);
        setNewCareerOpportunity("");
        setSuccessMessage("Career opportunity added successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to add career opportunity.");
      }
    } else {
      // For new courses, just update state
      setCareerOpportunities((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "career_opportunity",
          content: newCareerOpportunity.trim(),
        },
      ]);
      setNewCareerOpportunity("");
    }
  };

  const handleUpdateCareerOpportunity = async (opportunityId) => {
    if (!editingOpportunityText.trim()) return;

    // For existing courses, make API call. For new courses, just update state.
    if (selectedCourse?.id) {
      try {
        await courseService.updateCourseRequirement(selectedCourse.id, opportunityId, editingOpportunityText.trim());
        setCareerOpportunities((prev) =>
          prev.map((opp) => (opp.id === opportunityId ? { ...opp, content: editingOpportunityText.trim() } : opp))
        );
        setEditingOpportunityId(null);
        setEditingOpportunityText("");
        setSuccessMessage("Career opportunity updated successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to update career opportunity.");
      }
    } else {
      // For new courses, just update state
      setCareerOpportunities((prev) =>
        prev.map((opp) => (opp.id === opportunityId ? { ...opp, content: editingOpportunityText.trim() } : opp))
      );
      setEditingOpportunityId(null);
      setEditingOpportunityText("");
    }
  };

  const handleDeleteCareerOpportunity = async (opportunityId) => {
    if (!window.confirm("Delete this career opportunity?")) return;

    // For existing courses, make API call. For new courses, just update state.
    if (selectedCourse?.id) {
      try {
        await courseService.deleteCourseRequirement(selectedCourse.id, opportunityId);
        setCareerOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
        setSuccessMessage("Career opportunity deleted successfully.");
      } catch (err) {
        console.error(err);
        setError("Failed to delete career opportunity.");
      }
    } else {
      // For new courses, just update state
      setCareerOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
    }
  };

  const startEditingCareerOpportunity = (opportunity) => {
    setEditingOpportunityId(opportunity.id);
    setEditingOpportunityText(opportunity.content || "");
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Courses Management</h2>
          <p className="text-muted mb-0">Create, organize and monitor all courses.</p>
        </div>

        <button className="btn btn-success rounded-pill px-4" onClick={openCreateModal}>
          <Plus size={18} className="me-2" />
          Add Course
        </button>
      </div>

      {error ? <div className="alert alert-danger rounded-4" role="alert">{error}</div> : null}
      {successMessage ? <div className="alert alert-success rounded-4" role="alert">{successMessage}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <BookOpen size={28} />
                </div>
                <div>
                  <small className="text-muted">Total Courses</small>
                  <h3 className="fw-bold mb-0">{stats.totalCourses}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <Users size={28} />
                </div>
                <div>
                  <small className="text-muted">Active Courses</small>
                  <h3 className="fw-bold mb-0">{stats.active}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <GraduationCap size={28} />
                </div>
                <div>
                  <small className="text-muted">Duration Weeks</small>
                  <h3 className="fw-bold mb-0">{stats.totalDurationWeeks}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status || "All Statuses"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={levelFilter}
                onChange={(event) => {
                  setLevelFilter(event.target.value);
                  setPage(1);
                }}
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level || "All Levels"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2 text-end">
              <button
                className="btn btn-outline-secondary rounded-pill"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setLevelFilter("");
                }}
              >
                <Filter size={16} className="me-2" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Status</th>
                <th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading courses...
                  </td>
                </tr>
              )}

              {!loading && pagedCourses.map((course) => (
                <tr key={course.id}>
                  <td className="fw-semibold">{course.title}</td>
                  <td>{getCourseInstructor(course)}</td>
                  <td>{getCourseCategory(course)}</td>
                  <td>{getCourseDuration(course)}</td>
                  <td>
                    <span className={`badge ${["published", "active"].includes((course.status || "").toLowerCase()) ? "bg-success" : "bg-warning"}`}>
                      {getCourseStatus(course)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => openViewModal(course)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-success rounded-pill" onClick={() => openEditModal(course)}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(course.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && pagedCourses.length === 0 && <div className="text-center py-5 text-muted">No courses found.</div>}
        </div>

        <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">
              Showing {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} of {total} courses
            </small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <select className="form-select form-select-sm" style={{ width: 80 }} value={perPage} onChange={(event) => { setPerPage(Number(event.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Prev</button>
              <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {modalMode === "view"
                    ? selectedCourse?.title || "Course details"
                    : modalMode === "edit"
                      ? "Edit Course"
                      : "Add Course"}
                </h5>
                <button type="button" className="btn-close" onClick={resetModal}></button>
              </div>

              {modalMode === "view" && selectedCourse ? (
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      {selectedCourse.image_url ? <img src={selectedCourse.image_url} alt={selectedCourse.title} className="img-fluid rounded-4 mb-3" style={{ maxHeight: 220, objectFit: "cover" }} /> : null}
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Title</h6>
                      <p>{selectedCourse.title}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Description</h6>
                      <p>{selectedCourse.description || "No description provided."}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Instructor</h6>
                      <p>{getCourseInstructor(selectedCourse)}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Category</h6>
                      <p>{getCourseCategory(selectedCourse)}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Level & Status</h6>
                      <p>{getCourseLevel(selectedCourse)} · {getCourseStatus(selectedCourse)}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Requirements</h6>
                      {requirements.length > 0 ? (
                        <ul className="list-unstyled">
                          {requirements.map((req) => (
                            <li key={req.id} className="mb-2 ps-3">
                              <span className="text-muted">•</span> {req.content || req.requirement}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No requirements specified.</p>
                      )}
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Learning Outcomes</h6>
                      {learningOutcomes.length > 0 ? (
                        <ul className="list-unstyled">
                          {learningOutcomes.map((outcome) => (
                            <li key={outcome.id} className="mb-2 ps-3">
                              <span className="text-muted">•</span> {outcome.content}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No learning outcomes specified.</p>
                      )}
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Career Opportunities</h6>
                      {careerOpportunities.length > 0 ? (
                        <ul className="list-unstyled">
                          {careerOpportunities.map((opp) => (
                            <li key={opp.id} className="mb-2 ps-3">
                              <span className="text-muted">•</span> {opp.content}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No career opportunities specified.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" value={form.title} onChange={handleFieldChange} required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Program</label>
                        <select className="form-select" name="program_id" value={form.program_id} onChange={handleFieldChange}>
                          <option value="">None</option>
                          {programs.map((program) => (
                            <option key={program.id} value={program.id}>{program.title || program.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Category</label>
                        <select className="form-select" name="category_id" value={form.category_id} onChange={handleFieldChange}>
                          <option value="">None</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Instructor</label>
                        <select className="form-select" name="instructor_id" value={form.instructor_id} onChange={handleFieldChange}>
                          <option value="">None</option>
                          {instructors.map((instructor) => (
                            <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Level</label>
                        <select className="form-select" name="level" value={form.level} onChange={handleFieldChange}>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={form.status} onChange={handleFieldChange}>
                          <option value="draft">Draft</option>
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="coming_soon">Coming Soon</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Delivery Mode</label>
                        <select className="form-select" name="delivery_mode" value={form.delivery_mode} onChange={handleFieldChange}>
                          <option value="">None</option>
                          <option value="Physical">Physical</option>
                          <option value="Weekend">Weekend</option>
                          <option value="Evening">Evening</option>
                          <option value="Online">Online</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Short Description</label>
                        <textarea className="form-control" rows="2" name="short_description" value={form.short_description} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="4" name="description" value={form.description} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Overview</label>
                        <textarea className="form-control" rows="3" name="overview" value={form.overview} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Objectives</label>
                        <textarea className="form-control" rows="3" name="objectives" value={form.objectives} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Syllabus</label>
                        <textarea className="form-control" rows="3" name="syllabus" value={form.syllabus} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Weekly Schedule</label>
                        <textarea className="form-control" rows="2" name="weekly_schedule" value={form.weekly_schedule} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Final Outcome</label>
                        <textarea className="form-control" rows="2" name="final_outcome" value={form.final_outcome} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Duration (weeks)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name="duration_weeks"
                          value={form.duration_weeks}
                          onChange={handleFieldChange}
                          placeholder="Enter duration in weeks"
                        />
                        <small className="text-muted">Example: enter 8 for an 8-week course.</small>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Class Schedule</label>
                        <input type="text" className="form-control" name="class_schedule" value={form.class_schedule} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Language</label>
                        <input type="text" className="form-control" name="language" value={form.language} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Tuition Fee</label>
                        <input type="number" min="0" step="0.01" className="form-control" name="tuition_fee" value={form.tuition_fee} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Registration Fee</label>
                        <input type="number" min="0" step="0.01" className="form-control" name="registration_fee" value={form.registration_fee} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Next Intake</label>
                        <input type="date" className="form-control" name="next_intake" value={form.next_intake} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check mt-4">
                          <input className="form-check-input" type="checkbox" name="featured" checked={Boolean(form.featured)} onChange={handleFieldChange} />
                          <label className="form-check-label">Featured Course</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Course Image</label>
                        <div className="border rounded-4 p-3">
                          <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                          <div className="mt-2 text-muted small">
                            {uploadingImage ? "Uploading image..." : "Upload an image to Cloudinary and attach it to this course."}
                          </div>
                          {form.image_url ? <div className="mt-3"><img src={form.image_url} alt="Course preview" className="img-fluid rounded-3" style={{ maxHeight: 180, objectFit: "cover" }} /></div> : null}
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Course Requirements</label>
                        <div className="mb-3">
                          <div className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add a new requirement..."
                              value={newRequirement}
                              onChange={(e) => setNewRequirement(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleAddRequirement()}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={handleAddRequirement}
                              disabled={!newRequirement.trim()}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {requirements.length > 0 && (
                          <div className="border rounded-3 p-3">
                            <div className="list-group list-group-flush">
                              {requirements.map((req) => (
                                <div key={req.id} className="list-group-item px-0 d-flex justify-content-between align-items-start py-2">
                                  {editingRequirementId === req.id ? (
                                    <div className="flex-grow-1 d-flex gap-2">
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editingRequirementText}
                                        onChange={(e) => setEditingRequirementText(e.target.value)}
                                        autoFocus
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateRequirement(req.id)}
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                          setEditingRequirementId(null);
                                          setEditingRequirementText("");
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="text-muted me-2">•</span>
                                      <span className="flex-grow-1">{req.content || req.requirement}</span>
                                      <div className="d-flex gap-1">
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={() => startEditingRequirement(req)}
                                        >
                                          <Pencil size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => handleDeleteRequirement(req.id)}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">Learning Outcomes</label>
                        <div className="mb-3">
                          <div className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add a learning outcome..."
                              value={newLearningOutcome}
                              onChange={(e) => setNewLearningOutcome(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleAddLearningOutcome()}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={handleAddLearningOutcome}
                              disabled={!newLearningOutcome.trim()}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {learningOutcomes.length > 0 && (
                          <div className="border rounded-3 p-3">
                            <div className="list-group list-group-flush">
                              {learningOutcomes.map((outcome) => (
                                <div key={outcome.id} className="list-group-item px-0 d-flex justify-content-between align-items-start py-2">
                                  {editingOutcomeId === outcome.id ? (
                                    <div className="flex-grow-1 d-flex gap-2">
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editingOutcomeText}
                                        onChange={(e) => setEditingOutcomeText(e.target.value)}
                                        autoFocus
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateLearningOutcome(outcome.id)}
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                          setEditingOutcomeId(null);
                                          setEditingOutcomeText("");
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="text-muted me-2">•</span>
                                      <span className="flex-grow-1">{outcome.content}</span>
                                      <div className="d-flex gap-1">
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={() => startEditingLearningOutcome(outcome)}
                                        >
                                          <Pencil size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => handleDeleteLearningOutcome(outcome.id)}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">Career Opportunities</label>
                        <div className="mb-3">
                          <div className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add a career opportunity..."
                              value={newCareerOpportunity}
                              onChange={(e) => setNewCareerOpportunity(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleAddCareerOpportunity()}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={handleAddCareerOpportunity}
                              disabled={!newCareerOpportunity.trim()}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {careerOpportunities.length > 0 && (
                          <div className="border rounded-3 p-3">
                            <div className="list-group list-group-flush">
                              {careerOpportunities.map((opp) => (
                                <div key={opp.id} className="list-group-item px-0 d-flex justify-content-between align-items-start py-2">
                                  {editingOpportunityId === opp.id ? (
                                    <div className="flex-grow-1 d-flex gap-2">
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editingOpportunityText}
                                        onChange={(e) => setEditingOpportunityText(e.target.value)}
                                        autoFocus
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateCareerOpportunity(opp.id)}
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                          setEditingOpportunityId(null);
                                          setEditingOpportunityText("");
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="text-muted me-2">•</span>
                                      <span className="flex-grow-1">{opp.content}</span>
                                      <div className="d-flex gap-1">
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={() => startEditingCareerOpportunity(opp)}
                                        >
                                          <Pencil size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => handleDeleteCareerOpportunity(opp.id)}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary" onClick={resetModal}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={saving || uploadingImage}>
                      {saving ? "Saving..." : modalMode === "edit" ? "Save Changes" : "Create Course"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CoursesPage;