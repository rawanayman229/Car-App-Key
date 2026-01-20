document.addEventListener("DOMContentLoaded", () => {
  // HTML Elements
  const toggleBtn = document.getElementById("toggleSidebar");
  const closeBtn = document.getElementById("closeSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const body = document.body;
  const links = document.querySelectorAll(".menu a");
  const pages = document.querySelectorAll(".page");

  // Toggle sidebar Logic
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      if (window.innerWidth > 992) {
        body.classList.toggle("sidebar-collapsed");
      } else {
        body.classList.toggle("sidebar-open");
      }
    };
  }

  // Overlay of sideber
  if (overlay) overlay.onclick = () => body.classList.remove("sidebar-open");

  // Close sidebar
  if (closeBtn) closeBtn.onclick = () => body.classList.remove("sidebar-open");

  // Sidebar active link
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // remove active from menu
      document
        .querySelectorAll(".menu li")
        .forEach((li) => li.classList.remove("active"));
      link.parentElement.classList.add("active");

      // hide all pages
      pages.forEach((page) => page.classList.remove("active"));

      // show target page
      const target = link.getAttribute("data-target");
      document.getElementById(target).classList.add("active");

      // Close sidebar on mobile after click
      if (window.innerWidth <= 992) {
        body.classList.remove("sidebar-open");
      }
    });
  });

  // --- ApexCharts Logic (Dashboard page) ---
  const lineEl = document.querySelector("#lineChart");
  const pieEl = document.querySelector("#pieChart");

  if (lineEl) {
    new ApexCharts(lineEl, {
      series: [
        { name: "Jobs", type: "line", data: [0, 60, 120, 180, 240] },
        {
          name: "Revenue ($)",
          type: "line",
          data: [0, 25000, 50000, 75000, 100000],
        },
      ],

      chart: { height: 300, type: "line", toolbar: { show: false } },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#2563EB", "#10B981"],
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    }).render();
  }

  if (pieEl) {
    new ApexCharts(pieEl, {
      series: [75, 18, 7],
      chart: { type: "donut", height: 320 },
      labels: ["Active", "Inactive", "Pending"],
      colors: ["#10B981", "#6B7280", "#F59E0B"],
      legend: { position: "bottom" },
    }).render();
  }
});

// --DataTable Logic (Users Management Page)--
$(document).ready(function () {
  var table = $("#usersTable").DataTable({
    info: false,
    dom: 'rt<"d-flex justify-content-center"p>',
    pageLength: 7,
    ordering: true,
    responsive: false,
    columnDefs: [{ orderable: false, targets: 4 }],
    language: {
      paginate: {
        next: '<i class="fas fa-chevron-right"></i>',
        previous: '<i class="fas fa-chevron-left"></i>',
      },
    },
  });

  // Search Input Logic
  $("#customSearch").on("keyup", function () {
    table.search(this.value).draw();
  });

  // Filter Logic
  $("#roleFilter").on("change", function () {
    var selectedRole = $(this).val();
    table.column(1).search(selectedRole).draw();
  });
});
