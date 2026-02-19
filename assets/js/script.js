document.addEventListener("DOMContentLoaded", () => {
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

  //======== Start Of Dashboard Page=========

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

//======== End Of Dashboard Page=========

// GLOBAL HELPER FUNCTIONS (Available to all pages)

// Renders: Name (Top) + Subtext (Bottom)
window.renderDoubleLine = (line1, line2, classPrefix) => {
  return `
        <div class="${classPrefix}-info">
            <span class="${classPrefix}-name">${line1}</span>
            <span class="${classPrefix}-email" style="display:block; font-size:12px; color:#6b7280;">${line2}</span>
        </div>
    `;
};

// Renders: Colored Badges based on status text
window.renderStatusBadge = (status) => {
  let className = "badge-status-inactive";
  const s = (status || "").toLowerCase();

  if (s === "active" || s === "completed") className = "badge-status-active";
  else if (s === "pending") className = "badge-status-pending";
  else if (s === "suspended" || s === "cancelled")
    className = "badge-status-suspended";
  else if (s === "in progress") className = "badge-status-in-progress";
  else if (s === "rejected") className = "badge-status-rejected";
  else if (s === "admin") className = "badge-role-admin";
  else if (s === "dispatcher") className = "badge-role-dispatcher";
  else if (s === "urgent") className = "badge-priority-urgent";
  else if (s === "normal") className = "badge-priority-normal";
  return `<span class="badge ${className}">${status}</span>`;
};

window.renderActions = (actions = []) => {
  return `
    <div class="action-btns">
      ${actions
        .map(
          (action) => `
            <i 
              class="${action.icon}" 
              title="${action.title || ""}" 
              onclick="${action.onClick || ""}">
            </i>
          `,
        )
        .join("")}
    </div>
  `;
};

// GLOBAL Data-table FUNCTION
/**
 * @param {string} tableId
 * @param {Array|String} dataOrUrl
 * @param {Array} columnsConfig
 * @param {Object} filters
 */
window.initDataTable = function (
  tableId,
  dataOrUrl,
  columnsConfig,
  filters = {},
) {
  if (!$(tableId).length) return;

  const isServerSide = typeof dataOrUrl === "string";

  const table = $(tableId).DataTable({
    processing: true,
    serverSide: isServerSide,
    data: isServerSide ? null : dataOrUrl,
    ajax: isServerSide ? dataOrUrl : null,
    columns: columnsConfig,
    pageLength: 7,
    info: false,
    lengthChange: false,
    ordering: true,
    dom: 'rt<"d-flex justify-content-center"p>',
    language: {
      paginate: {
        next: '<i class="fas fa-chevron-right"></i>',
        previous: '<i class="fas fa-chevron-left"></i>',
      },
      emptyTable: "No data available in table",
    },
  });

  // Bind Custom Search Input
  $("#customSearch").on("keyup", function () {
    table.search(this.value).draw();
  });

  // Bind External Dropdown Filters
  Object.keys(filters).forEach((selector) => {
    $(selector).on("change", function () {
      const val = $(this).val();
      table.column(filters[selector]).search(val).draw();
    });
  });

  return table;
};

// GLOBAL Form Validation Function (User Profile in Sidebar)
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");

  if (!user) {
    if (!location.pathname.endsWith("index.html")) {
      window.location.href = "index.html";
    }
    return;
  }

  const userData = JSON.parse(user);

  // Inject user info in sidebar
  const sidebarUsername = document.getElementById("sidebarUsername");
  const sidebarEmail = document.getElementById("sidebarEmail");
  const userAvatar = document.getElementById("userAvatar");

  if (sidebarUsername) sidebarUsername.textContent = userData.username;
  if (sidebarEmail) sidebarEmail.textContent = userData.email;
  if (userAvatar)
    userAvatar.textContent = userData.username.charAt(0).toUpperCase();
});
