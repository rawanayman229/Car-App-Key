// Global variables for tables
let usersTable = null;
let companiesTable = null;

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SIDEBAR & NAVIGATION ---
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

  // --- 2. APEX CHARTS (Dashboard Only) ---
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

$(document).ready(function () {
  // --- 3. USERS MANAGEMENT PAGE ---
  if ($("#usersTable").length && $.fn.DataTable) {
    usersTable = $("#usersTable").DataTable({
      info: false,
      dom: 'rt<"d-flex justify-content-center"p>',
      pageLength: 7,
      ordering: true,
      columnDefs: [{ orderable: false, targets: 4 }],
      language: {
        paginate: {
          next: '<i class="fas fa-chevron-right"></i>',
          previous: '<i class="fas fa-chevron-left"></i>',
        },
      },
    });

    // User Search
    $("#customSearch").on("keyup", function () {
      usersTable.search(this.value).draw();
    });

    // --- ADDED FILTER BACK HERE ---
    // Filter by Role (Column index 1)
    $("#roleFilter").on("change", function () {
      usersTable.column(1).search(this.value).draw();
    });

    // Add User Logic
    $(".add-user-btn").on("click", function () {
      $("#createUserModal").modal("show");
    });

    $("#saveUserBtn").on("click", function () {
      const fName = $("#firstName").val().trim();
      const lName = $("#lastName").val().trim();
      const email = $("#email").val().trim();
      const role = $("#role").val();

      if (!fName || !email) return alert("Please fill required fields");

      usersTable.row
        .add([
          `<div class="user-info"><span class="user-name">${fName} ${lName}</span><span class="user-email">${email}</span></div>`,
          `<span class="badge badge-role-admin">${role}</span>`,
          new Date().toLocaleDateString(),
          `<span class="badge badge-status-active">Active</span>`,
          `<i class="fa-solid fa-ellipsis-vertical"></i>`,
        ])
        .draw();

      $("#createUserModal").modal("hide");
    });
  }

  // --- 4. COMPANIES MANAGEMENT PAGE ---
  if ($("#companiesTable").length && $.fn.DataTable) {
    companiesTable = $("#companiesTable").DataTable({
      info: false,
      dom: 'rt<"d-flex justify-content-center"p>',
      pageLength: 6,
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
    const stored =
      JSON.parse(localStorage.getItem("locksmith_companies")) || [];
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

      const list =
        JSON.parse(localStorage.getItem("locksmith_companies")) || [];
      list.push(newCompany);
      localStorage.setItem("locksmith_companies", JSON.stringify(list));

      alert("Company successfully added!");
      window.location.href = "companies.html";
    });
  }
});
