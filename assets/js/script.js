// Global variables for tables
let companiesTable = null;

document.addEventListener("DOMContentLoaded", () => {
  // ---  SIDEBAR & NAVIGATION ---
  const toggleBtn = document.getElementById("toggleSidebar");
  const closeBtn = document.getElementById("closeSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const body = document.body;
  const currentPage = location.pathname.split("/").pop() || "dashboard.html";

  // Active Link logic
  document.querySelectorAll(".menu li").forEach((li) => {
    const link = li.querySelector("a");
    if (link && link.getAttribute("href") === currentPage) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });

  // Toggle Sidebar
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      window.innerWidth > 992
        ? body.classList.toggle("sidebar-collapsed")
        : body.classList.toggle("sidebar-open");
    };
  }
  if (overlay) overlay.onclick = () => body.classList.remove("sidebar-open");
  if (closeBtn) closeBtn.onclick = () => body.classList.remove("sidebar-open");

  //======== Start Of Dahsboard Page=========

  // --- APEX CHARTS (Dashboard Only) ---
  const lineEl = document.querySelector("#lineChart");
  const pieEl = document.querySelector("#pieChart");

  if (lineEl && typeof ApexCharts !== "undefined") {
    new ApexCharts(lineEl, {
      series: [
        { name: "Jobs", data: [0, 60, 120, 180, 240] },
        { name: "Revenue ($)", data: [0, 25000, 50000, 75000, 100000] },
      ],
      chart: { height: 300, type: "line", toolbar: { show: false } },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#2563EB", "#10B981"],
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
    }).render();
  }

  if (pieEl && typeof ApexCharts !== "undefined") {
    new ApexCharts(pieEl, {
      series: [75, 18, 7],
      chart: { type: "donut", height: 320 },
      labels: ["Active", "Inactive", "Pending"],
      colors: ["#10B981", "#6B7280", "#F59E0B"],
      legend: { position: "bottom" },
    }).render();
  }
});

//======== End Of Dahsboard Page=========

// --- Start Of USERS MANAGEMENT PAGE ---
const mockUsers = [
  {
    name: "John Smith",
    email: "john.smith@platform.com",
    role: "Admin",
    last_login: "2026-01-07 09:30 AM",
    status: "Active",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@platform.com",
    role: "Dispatcher",
    last_login: "2026-01-07 08:15 AM",
    status: "Active",
  },
  {
    name: "Mike Williams",
    email: "mike.w@abclock.com",
    role: "Admin",
    last_login: "2026-01-06 05:45 PM",
    status: "Active",
  },
  {
    name: "Emily Davis",
    email: "emily.d@platform.com",
    role: "Dispatcher",
    last_login: "2026-01-05 02:20 PM",
    status: "Inactive",
  },
  {
    name: "John Smith",
    email: "john.smith@platform.com",
    role: "Admin",
    last_login: "2026-01-07 09:30 AM",
    status: "Active",
  },
  {
    name: "John Smith",
    email: "john.smith@platform.com",
    role: "Admin",
    last_login: "2026-01-07 09:30 AM",
    status: "Active",
  },
  {
    name: "John Smith",
    email: "john.smith@platform.com",
    role: "Admin",
    last_login: "2026-01-07 09:30 AM",
    status: "Active",
  },
  {
    name: "John Smith",
    email: "john.smith@platform.com",
    role: "Admin",
    last_login: "2026-01-07 09:30 AM",
    status: "Active",
  },
];

$(document).ready(function () {
  const table = $("#usersTable").DataTable({
    data: mockUsers,
    pageLength: 7,
    info: false,
    ordering: true,
    searching: true,
    dom: 'rt<"d-flex justify-content-center"p>',

    columnDefs: [{ orderable: false, targets: 4 }],

    columns: [
      {
        data: null,
        render: (data) => `
          <div class="user-info">
            <span class="user-name">${data.name}</span>
            <span class="user-email">${data.email}</span>
          </div>
        `,
      },
      {
        data: "role",
        render: (role) =>
          role === "Admin"
            ? `<span class="badge badge-role-admin">Admin</span>`
            : `<span class="badge badge-role-dispatcher">Dispatcher</span>`,
      },
      { data: "last_login" },
      {
        data: "status",
        render: (status) =>
          status === "Active"
            ? `<span class="badge badge-status-active">Active</span>`
            : `<span class="badge badge-status-inactive">Inactive</span>`,
      },
      {
        data: null,
        render: () => `
          <div class="action-btns">
            <i class="fa-solid fa-key"></i>
            <i class="fa-solid fa-pen"></i>
            <i class="fa-solid fa-trash-can"></i>
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </div>
        `,
      },
    ],

    language: {
      paginate: {
        next: '<i class="fas fa-chevron-right"></i>',
        previous: '<i class="fas fa-chevron-left"></i>',
      },
    },
  });

  // Custom Search
  $("#customSearch").on("keyup", function () {
    table.search(this.value).draw();
  });

  //  Role Filter
  $("#roleFilter").on("change", function () {
    table.column(1).search(this.value).draw();
  });

  // Add User Modal
  $(".add-user-btn").on("click", function () {
    $("#createUserModal").modal("show");
  });

  //  Save User
  $("#saveUserBtn").on("click", function () {
    const fName = $("#firstName").val().trim();
    const lName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const role = $("#role").val();

    if (!fName || !email) {
      alert("Please fill required fields");
      return;
    }

    const user = {
      name: `${fName} ${lName}`,
      email,
      role,
      last_login: new Date().toLocaleString(),
      status: "Active",
    };

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem("locksmith_users")) || [];
    users.push(user);
    localStorage.setItem("locksmith_users", JSON.stringify(users));

    // Correct way: add OBJECT 
    table.row.add(user).draw();

    $("#createUserModal").modal("hide");
  });
});

// --- End Of USERS MANAGEMENT PAGE ---

// --- Start Of COMPANIES MANAGEMENT PAGE ---

if ($("#companiesTable").length && $.fn.DataTable) {
  companiesTable = $("#companiesTable").DataTable({
    info: false,
    dom: 'rt<"d-flex justify-content-center"p>',
    pageLength: 7,
    ordering: true,
    columnDefs: [{ orderable: false, targets: 5 }],
    language: {
      paginate: {
        next: '<i class="fas fa-chevron-right"></i>',
        previous: '<i class="fas fa-chevron-left"></i>',
      },
    },
  });

  // Search Companies
  $("#customSearch").on("keyup", function () {
    companiesTable.search(this.value).draw();
  });

  // Load dynamic companies from LocalStorage
  const stored = JSON.parse(localStorage.getItem("locksmith_companies")) || [];
  stored.forEach((c) => {
    let bClass =
      c.status === "active"
        ? "badge-status-active"
        : c.status === "pending"
          ? "badge-status-pending"
          : "badge-status-suspended";

    companiesTable.row
      .add([
        `<div class="company-info"><span class="company-name">${c.name}</span><span class="company-date">Joined ${c.date}</span></div>`,
        `<div class="company-info"><span class="company-email">${c.email}</span><span class="company-number">${c.phone}</span></div>`,
        c.city,
        "0",
        `<span class="badge ${bClass}">${c.status}</span>`,
        `<i class="fa-solid fa-ellipsis-vertical"></i>`,
      ])
      .draw();
  });

  // Navigate to Add Page
  $(".add-company-btn").on("click", function () {
    window.location.href = "createCompany.html";
  });
}

// --- 5. CREATE COMPANY FORM LOGIC ---
if ($("#createCompanyForm").length) {
  $("#createCompanyForm").on("submit", function (e) {
    e.preventDefault();

    // IDs must match your HTML input IDs
    const newCompany = {
      name: $("#compName").val() || $("input[placeholder*='ABC']").val(),
      email:
        $("#compEmail").val() ||
        $("input[placeholder='contact@company.com']").val(),
      phone:
        $("#compPhone").val() ||
        $("input[placeholder='(555) 123-4567']").eq(0).val(),
      status: $("#compStatus").val() || "active",
      city: $("#compCity").val() || "New York",
      date: new Date().toISOString().split("T")[0],
    };

    if (!newCompany.name || !newCompany.email) {
      alert("Company Name and Email are required");
      return;
    }

    const list = JSON.parse(localStorage.getItem("locksmith_companies")) || [];
    list.push(newCompany);
    localStorage.setItem("locksmith_companies", JSON.stringify(list));

    alert("Company successfully added!");
    window.location.href = "companies.html";
  });
}

// --- End Of COMPANIES MANAGEMENT PAGE ---

// 5- ==== Start Of Jobs PAge====

if ($("#jobsTable").length && $.fn.DataTable) {
  jobsTable = $("#jobsTable").DataTable({
    info: false,
    dom: 'rt<"d-flex justify-content-center"p>',
    pageLength: 7,
    ordering: true,
    columnDefs: [{ orderable: false, targets: 7 }],
    language: {
      paginate: {
        next: '<i class="fas fa-chevron-right"></i>',
        previous: '<i class="fas fa-chevron-left"></i>',
      },
    },
  });

  // Search jobs
  $("#customSearch").on("keyup", function () {
    jobsTable.search(this.value).draw();
  });

  // Load dynamic jobs from LocalStorage
  const stored = JSON.parse(localStorage.getItem("locksmith_jobs")) || [];
  stored.forEach((c) => {
    let bClass =
      c.status === "completed"
        ? "badge-status-completed"
        : c.status === "pending"
          ? "badge-status-pending"
          : c.status === "in progress"
            ? "badge-status-in-progress"
            : "badge-status-cancelled";

    jobsTable.row
      .add([
        `<div class="job-info">
          <span class="job-id">${c.id}</span>
          <span class="job-date">${c.date}</span>
        </div>`,
        c.customer || "-",
        c.company || "-",
        c.service || "-",
        c.location || "-",
        c.amount ? `$${c.amount}` : "-",
        `<span class="badge ${bClass}">${c.status}</span>`,
        `<i class="fa-solid fa-ellipsis-vertical"></i>`,
      ])
      .draw(false);
  });

  // Navigate to Add Job Page
  $(".add-job-btn").on("click", function () {
    window.location.href = "createJob.html";
  });
}

// Add Job Form Logic
let currentStep = 1;
let jobData = {
  priority: "normal",
  service: "",
};

document.querySelectorAll(".jobs-tab").forEach((tab) => {
  if (tab.href === window.location.href) {
    tab.classList.add("active");
  }
});

function goToStep(step) {
  document
    .querySelectorAll(".job-step")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelector(`.job-step[data-step="${step}"]`)
    .classList.add("active");

  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));
  document.querySelector(`.step[data-step="${step}"]`).classList.add("active");

  currentStep = step;
}

// Validation on step 1
function validateStep1() {
  const serviceInput = document.getElementById("serve-type");
  const serviceSelect = document.getElementById("serviceType");
  const error = document.getElementById("serviceError");

  const inputValue = serviceInput.value.trim();
  const selectValue = serviceSelect.value;

  if (!inputValue && !selectValue) {
    error.classList.remove("d-none");

    serviceInput.classList.add("is-invalid");
    serviceSelect.classList.add("is-invalid");

    return;
  }

  const finalService = inputValue || selectValue;

  jobData.service = finalService;

  error.classList.add("d-none");
  serviceInput.classList.remove("is-invalid");
  serviceSelect.classList.remove("is-invalid");

  goToStep(2);
}

// Hide error when typing
document.getElementById("serve-type").addEventListener("input", function () {
  if (this.value.trim()) {
    document.getElementById("serviceError").classList.add("d-none");
    this.classList.remove("is-invalid");
    document.getElementById("serviceType").classList.remove("is-invalid");
  }
});

// Hide error when selecting
document.getElementById("serviceType").addEventListener("change", function () {
  if (this.value) {
    document.getElementById("serviceError").classList.add("d-none");
    this.classList.remove("is-invalid");
    document.getElementById("serve-type").classList.remove("is-invalid");
  }
});

// Priority select
document.querySelectorAll(".priority-card").forEach((card) => {
  card.addEventListener("click", () => {
    document
      .querySelectorAll(".priority-card")
      .forEach((c) => c.classList.remove("active"));

    card.classList.add("active");
    jobData.priority = card.dataset.priority;
  });
});

function submitJob() {
  jobData.service = document.getElementById("serviceType").value;
  jobData.customer = document.getElementById("customerName").value;
  jobData.phone = document.getElementById("customerPhone").value;
  jobData.amount = document.getElementById("amount").value;
  jobData.company = document.getElementById("company").value;
  jobData.date = new Date().toISOString().split("T")[0];
  jobData.status = "pending";

  const list = JSON.parse(localStorage.getItem("locksmith_jobs")) || [];
  list.push(jobData);
  localStorage.setItem("locksmith_jobs", JSON.stringify(list));

  alert("Job created successfully!");
  window.location.href = "jobs.html";
}

// ================= STEP 2: CUSTOMER LOGIC =================
let selectedCustomer = null;

/* 1️⃣ Load users from LocalStorage */
function getCustomersFromUsers() {
  return JSON.parse(localStorage.getItem("locksmith_users")) || [];
}

/* Render customers */
function loadCustomers() {
  const customers = getCustomersFromUsers();
  const container = document.getElementById("customersList");

  if (!container) return;
  container.innerHTML = "";

  if (customers.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4">
        <p class="text-muted">
          No existing customers found. Click "Create New" to start.
        </p>
      </div>`;
    return;
  }

  customers.forEach((c) => {
    const card = document.createElement("div");
    card.className = "customer-card";
    card.innerHTML = `
      <strong>${c.name}</strong>
      <div>${c.phone} • ${c.email}</div>
    `;

    card.addEventListener("click", () => {
      document
        .querySelectorAll(".customer-card")
        .forEach((el) => el.classList.remove("active"));

      card.classList.add("active");
      selectedCustomer = c;

      document.getElementById("customerError").classList.add("d-none");
    });

    container.appendChild(card);
  });
}

/* Toggle between Existing / Create */
function toggleCustomerMode(mode) {
  const existingSection = document.getElementById("existingCustomersSection");
  const createSection = document.getElementById("createCustomerSection");

  const selectBtn = document.getElementById("selectExistingBtn");
  const createBtn = document.getElementById("createNewBtn");

  if (mode === "existing") {
    existingSection.classList.remove("d-none");
    createSection.classList.add("d-none");

    selectBtn.classList.add("active");
    selectBtn.classList.remove("outline");

    createBtn.classList.add("outline");
    createBtn.classList.remove("active");

    loadCustomers();
  } else {
    existingSection.classList.add("d-none");
    createSection.classList.remove("d-none");

    createBtn.classList.add("active");
    createBtn.classList.remove("outline");

    selectBtn.classList.add("outline");
    selectBtn.classList.remove("active");
  }
}

/* Validate Step 2 before continue */
function validateStep2() {
  if (!selectedCustomer) {
    document.getElementById("customerError").classList.remove("d-none");
    return false;
  }

  jobData.customer = selectedCustomer.name;
  jobData.email = selectedCustomer.email;

  return true;
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  toggleCustomerMode("existing");

  document
    .getElementById("selectExistingBtn")
    ?.addEventListener("click", () => toggleCustomerMode("existing"));

  document
    .getElementById("createNewBtn")
    ?.addEventListener("click", () => toggleCustomerMode("new"));
});
