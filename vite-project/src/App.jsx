import { useEffect, useMemo, useState } from "react";
import "./App.css";

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Consulting",
    description: "Enterprise consulting and advisory services",
    status: "Active",
    created: "Sep 24, 2026",
  },
  {
    id: 2,
    name: "Software Services",
    description: "Software development and technical services",
    status: "Active",
    created: "Sep 21, 2026",
  },
  {
    id: 3,
    name: "Training",
    description: "Professional training and workshops",
    status: "Active",
    created: "Sep 18, 2026",
  },
  {
    id: 4,
    name: "Maintenance",
    description: "Technical maintenance and support",
    status: "Inactive",
    created: "Sep 15, 2026",
  },
  {
    id: 5,
    name: "Licensing",
    description: "Product and software licensing income",
    status: "Active",
    created: "Sep 12, 2026",
  },
  {
    id: 6,
    name: "Subscription",
    description: "Recurring subscription income",
    status: "Active",
    created: "Sep 09, 2026",
  },
  {
    id: 7,
    name: "Implementation",
    description: "Enterprise implementation projects",
    status: "Active",
    created: "Sep 05, 2026",
  },
  {
    id: 8,
    name: "Support",
    description: "Customer support and service contracts",
    status: "Inactive",
    created: "Sep 02, 2026",
  },
];

const isCategoryList = (value) =>
  Array.isArray(value) &&
  value.every(
    (category) =>
      category &&
      typeof category.id === "number" &&
      typeof category.name === "string" &&
      typeof category.description === "string" &&
      (category.status === "Active" ||
        category.status === "Inactive") &&
      typeof category.created === "string"
  );

function App() {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("incomeCategories");
      const parsed = saved ? JSON.parse(saved) : null;

      return isCategoryList(parsed)
        ? parsed
        : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const [error, setError] = useState("");

  const itemsPerPage = 5;

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "incomeCategories",
      JSON.stringify(categories)
    );
  }, [categories]);

  /* =========================
     STATISTICS
  ========================= */

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.status === "Active"
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  const activePercentage =
    totalCategories === 0
      ? 0
      : Math.round(
          (activeCategories / totalCategories) * 100
        );

  /* =========================
     FILTER + SORT
  ========================= */

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(keyword) ||
          category.description
            .toLowerCase()
            .includes(keyword)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (category) => category.status === statusFilter
      );
    }

    if (sortBy === "Newest") {
      result.sort((a, b) => b.id - a.id);
    }

    if (sortBy === "Oldest") {
      result.sort((a, b) => a.id - b.id);
    }

    if (sortBy === "Name A-Z") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "Name Z-A") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [
    categories,
    search,
    statusFilter,
    sortBy,
  ]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCategories.length / itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * itemsPerPage;

  const visibleCategories =
    filteredCategories.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  useEffect(() => {
    if (!modalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setEditingCategory(null);
        setError("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    if (!notice) return undefined;

    const timeoutId = window.setTimeout(() => {
      setNotice("");
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  /* =========================
     MODAL
  ========================= */

  const openAddModal = () => {
    setEditingCategory(null);

    setForm({
      name: "",
      description: "",
      status: "Active",
    });

    setError("");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name,
      description: category.description,
      status: category.status,
    });

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setError("");
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  /* =========================
     FORM
  ========================= */

  const handleInputChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveCategory = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const description =
      form.description.trim();

    if (!name || !description) {
      setError(
        "Please complete all required fields."
      );

      return;
    }

    if (editingCategory) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name,
                description,
                status: form.status,
              }
            : category
        )
      );
    } else {
      const newCategory = {
        id: Date.now(),
        name,
        description,
        status: form.status,
        created: new Date().toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        ),
      };

      setCategories((previous) => [
        newCategory,
        ...previous,
      ]);
    }

    closeModal();
  };

  /* =========================
     DELETE
  ========================= */

  const deleteCategory = (id) => {
    const category = categories.find(
      (item) => item.id === id
    );

    if (!category) return;

    const confirmed = window.confirm(
      `Delete "${category.name}"?`
    );

    if (!confirmed) return;

    setCategories((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  /* =========================
     STATUS
  ========================= */

  const toggleStatus = (id) => {
    setCategories((previous) =>
      previous.map((category) =>
        category.id === id
          ? {
              ...category,
              status:
                category.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : category
      )
    );
  };

  /* =========================
     EXPORT CSV
  ========================= */

  const exportCSV = () => {
    if (!categories.length) {
      alert("There are no categories to export.");
      return;
    }

    const header =
      "Category Name,Description,Status,Created";

    const rows = categories.map((category) =>
      [
        category.name,
        category.description,
        category.status,
        category.created,
      ]
        .map((value) =>
          `"${String(value).replaceAll('"', '""')}"`
        )
        .join(",")
    );

    const csv =
      [header, ...rows].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "income-categories.csv";

    link.click();

    URL.revokeObjectURL(url);
    setNotice("CSV export started.");
  };

  /* =========================
     NAVIGATION
  ========================= */

  const handleNavigation = (event, label) => {
    event.preventDefault();
    setSidebarOpen(false);

    if (label !== "Income Categories") {
      setNotice(`${label} is not available in this workspace yet.`);
    }
  };

  const showNotice = (message) => {
    setNotice(message);
  };

  return (
    <div className="dashboard">

      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="brand">

          <div className="brand-logo">
            $
          </div>

          <div>
            <h2>EnterpriseFlow</h2>
            <span>INCOME MANAGEMENT</span>
          </div>

        </div>

        <div className="menu-label">
          MAIN MENU
        </div>

        <nav className="navigation">

          <a
            href="#dashboard"
            className="nav-item"
            onClick={(event) =>
              handleNavigation(event, "Dashboard")
            }
          >
            <span className="nav-icon">
              ⌂
            </span>

            Dashboard
          </a>

          <a
            href="#categories"
            className="nav-item active"
            onClick={(event) =>
              handleNavigation(event, "Income Categories")
            }
          >
            <span className="nav-icon">
              ▦
            </span>

            Income Categories
          </a>

          <a
            href="#income"
            className="nav-item"
            onClick={(event) =>
              handleNavigation(event, "Income Records")
            }
          >
            <span className="nav-icon">
              $
            </span>

            Income Records
          </a>

          <a
            href="#reports"
            className="nav-item"
            onClick={(event) =>
              handleNavigation(event, "Reports")
            }
          >
            <span className="nav-icon">
              ◩
            </span>

            Reports
          </a>

        </nav>

        <div className="menu-label second">
          MANAGEMENT
        </div>

        <nav className="navigation">

          <a
            href="#users"
            className="nav-item"
            onClick={(event) =>
              handleNavigation(event, "Users")
            }
          >
            <span className="nav-icon">
              ◉
            </span>

            Users
          </a>

          <a
            href="#settings"
            className="nav-item"
            onClick={(event) =>
              handleNavigation(event, "Settings")
            }
          >
            <span className="nav-icon">
              ⚙
            </span>

            Settings
          </a>

        </nav>

        <div className="sidebar-bottom">

          <div className="support-box">

            <div className="support-icon">
              ?
            </div>

            <div>
              <strong>
                Need assistance?
              </strong>

              <span>
                Contact enterprise support
              </span>
            </div>

          </div>

        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="main">

        {/* =========================
            TOPBAR
        ========================= */}

        <header className="topbar">

          <div className="breadcrumb">

            <button
              className="mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              ☰
            </button>

            <span>
              Management
            </span>

            <b>/</b>

            <strong>
              Income Categories
            </strong>

          </div>

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="top-actions">

            <button
              className="icon-button"
              title="Notifications"
              aria-label="Show notifications"
              onClick={() =>
                showNotice("You are all caught up.")
              }
            >
              ♢
              <span className="notification-dot" />
            </button>

            <button
              className="icon-button"
              title="Help"
              aria-label="Show help"
              onClick={() =>
                showNotice(
                  "Use Add Category to create a new income source."
                )
              }
            >
              ?
            </button>

            <div className="profile">

              <div className="avatar">
                AD
              </div>

              <div className="profile-info">
                <strong>
                  Admin User
                </strong>

                <span>
                  Administrator
                </span>
              </div>

              <button
                type="button"
                className="profile-arrow"
                aria-label="Open profile menu"
                onClick={() =>
                  showNotice("Profile settings are not available yet.")
                }
              >
                ▾
              </button>

            </div>

          </div>

        </header>

        {/* =========================
            CONTENT
        ========================= */}

        <section className="content">

          <div className="page-heading">

            <div>
              <h1>
                Income Categories
              </h1>

              <p>
                Manage and organize your
                enterprise income sources.
              </p>
            </div>

            <button
              className="add-button"
              onClick={openAddModal}
            >
              <span>+</span>
              Add Category
            </button>

          </div>

          {/* =========================
              STATISTICS
          ========================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-top">

                <div className="stat-icon purple">
                  ▦
                </div>

                <span className="stat-change neutral">
                  Total
                </span>

              </div>

              <span className="stat-label">
                Total Categories
              </span>

              <strong className="stat-number">
                {totalCategories}
              </strong>

              <span className="stat-footer">
                All registered categories
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-top">

                <div className="stat-icon green">
                  ✓
                </div>

                <span className="stat-change positive">
                  Active
                </span>

              </div>

              <span className="stat-label">
                Active Categories
              </span>

              <strong className="stat-number">
                {activeCategories}
              </strong>

              <span className="stat-footer">
                Currently available
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-top">

                <div className="stat-icon orange">
                  ◷
                </div>

                <span className="stat-change neutral">
                  Review
                </span>

              </div>

              <span className="stat-label">
                Inactive Categories
              </span>

              <strong className="stat-number">
                {inactiveCategories}
              </strong>

              <span className="stat-footer">
                Currently disabled
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-top">

                <div className="stat-icon blue">
                  %
                </div>

                <span className="stat-change positive">
                  Live
                </span>

              </div>

              <span className="stat-label">
                Active Rate
              </span>

              <strong className="stat-number">
                {activePercentage}%
              </strong>

              <span className="stat-footer">
                Active category ratio
              </span>

            </div>

          </div>

          {/* =========================
              DATA CARD
          ========================= */}

          <div className="data-card">

            <div className="data-card-header">

              <div>
                <h2>
                  Registered Categories
                </h2>

                <p>
                  Review and manage your
                  income classification structure.
                </p>
              </div>

              <button
                className="outline-button"
                onClick={exportCSV}
              >
                ↓ Export CSV
              </button>

            </div>

            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="toolbar">

              <div className="search-box">

                <span>
                  ⌕
                </span>

                <input
                  type="search"
                  placeholder="Search categories..."
                  value={search}
                  onChange={handleSearchChange}
                />

              </div>

              <div className="filters">

                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

                <select
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="Newest">
                    Newest
                  </option>

                  <option value="Oldest">
                    Oldest
                  </option>

                  <option value="Name A-Z">
                    Name A-Z
                  </option>

                  <option value="Name Z-A">
                    Name Z-A
                  </option>
                </select>

              </div>

            </div>

            {/* =========================
                TABLE
            ========================= */}

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      Category
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created
                    </th>

                    <th className="action-column">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {visibleCategories.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="empty-state"
                      >
                        <div>
                          <div className="empty-icon">
                            ⌕
                          </div>

                          <strong>
                            No categories found
                          </strong>

                          <span>
                            Try adjusting your
                            search or filters.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visibleCategories.map(
                      (category) => (
                        <tr
                          key={category.id}
                        >

                          <td>

                            <div className="category-cell">

                              <div className="category-icon">
                                {category.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {category.name}
                                </strong>

                                <span>
                                  ID #
                                  {String(
                                    category.id
                                  ).slice(-5)}
                                </span>
                              </div>

                            </div>

                          </td>

                          <td>
                            <span className="description">
                              {category.description}
                            </span>
                          </td>

                          <td>

                            <button
                              className={`status ${
                                category.status ===
                                "Active"
                                  ? "active"
                                  : "inactive"
                              }`}
                              onClick={() =>
                                toggleStatus(
                                  category.id
                                )
                              }
                              title="Click to change status"
                            >
                              <i />
                              {category.status}
                            </button>

                          </td>

                          <td>
                            <span className="created-date">
                              {category.created}
                            </span>
                          </td>

                          <td className="action-column">

                            <div className="row-actions">

                              <button
                                className="row-button"
                                title="Edit category"
                                onClick={() =>
                                  openEditModal(
                                    category
                                  )
                                }
                              >
                                ✎
                              </button>

                              <button
                                className="row-button delete-button"
                                title="Delete category"
                                onClick={() =>
                                  deleteCategory(
                                    category.id
                                  )
                                }
                              >
                                ×
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* =========================
                TABLE FOOTER
            ========================= */}

            <div className="table-footer">

              <span>
                Showing{" "}
                <strong>
                  {filteredCategories.length === 0
                    ? 0
                    : startIndex + 1}
                </strong>
                {" "}to{" "}
                <strong>
                  {Math.min(
                    startIndex +
                      itemsPerPage,
                    filteredCategories.length
                  )}
                </strong>
                {" "}of{" "}
                <strong>
                  {filteredCategories.length}
                </strong>
                {" "}categories
              </span>

              <div className="pagination">

                <button
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(1, page - 1)
                    )
                  }
                >
                  ‹
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={
                      safeCurrentPage === page
                        ? "current"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(page)
                    }
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={
                    safeCurrentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                >
                  ›
                </button>

              </div>

            </div>

          </div>

          {/* =========================
              FOOTER
          ========================= */}

          <footer className="footer">

            <span>
              © 2026 EnterpriseFlow
            </span>

            <div>
              <button
                type="button"
                onClick={() => showNotice("Privacy details are not available yet.")}
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => showNotice("Terms are not available yet.")}
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => showNotice("Support is available from your administrator.")}
              >
                Support
              </button>
            </div>

          </footer>

        </section>

      </main>

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {modalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <form
            className="modal"
            onSubmit={saveCategory}
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add Income Category"}
                </h2>

                <p>
                  {editingCategory
                    ? "Update the category information."
                    : "Create a new enterprise income category."}
                </p>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <div className="modal-body">

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <label>

                Category Name
                <span>*</span>

                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. Consulting"
                  autoFocus
                />

              </label>

              <label>

                Description
                <span>*</span>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleInputChange
                  }
                  rows="4"
                  placeholder="Describe this income category..."
                />

              </label>

              <label>

                Status

                <select
                  name="status"
                  value={form.status}
                  onChange={
                    handleInputChange
                  }
                  style={{
                    width: "100%",
                    marginTop: "7px",
                    padding: "11px",
                    border:
                      "1px solid #dfe2e8",
                    borderRadius: "7px",
                    outline: "none",
                    fontSize: "11px",
                    background: "white",
                  }}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </label>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingCategory
                  ? "Update Category"
                  : "Save Category"}
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default App;
