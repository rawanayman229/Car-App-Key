/*GLOBAL UI LOGIC */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  const closeBtn = document.getElementById("closeSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const body = document.body;
  const currentPage = location.pathname.split("/").pop() || "dashboard.html";

  /* ===== Active Link Logic ===== */
  document.querySelectorAll(".menu li").forEach((li) => {
    const link = li.querySelector("a");
    if (link && link.getAttribute("href") === currentPage) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });

  /* ===== Sidebar Toggle ===== */
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      window.innerWidth > 992
        ? body.classList.toggle("sidebar-collapsed")
        : body.classList.toggle("sidebar-open");
    };
  }

  if (overlay) overlay.onclick = () => body.classList.remove("sidebar-open");
  if (closeBtn) closeBtn.onclick = () => body.classList.remove("sidebar-open");
});

/* GLOBAL HELPER FUNCTIONS*/
// Name + sub text
window.renderDoubleLine = (line1, line2, classPrefix) => {
  return `
    <div class="${classPrefix}-info">
      <span class="${classPrefix}-name">${line1}</span>
      <span class="${classPrefix}-email" style="display:block;font-size:12px;color:#6b7280;">
        ${line2}
      </span>
    </div>
  `;
};

// Status badge renderer
window.renderStatusBadge = (status) => {
  let className = "badge-status-inactive";
  const s = (status || "").toLowerCase();

  if (s === "active" || s === "completed") className = "badge-status-active";
  else if (s === "pending") className = "badge-status-pending";
  else if (s === "suspended" || s === "cancelled")className = "badge-status-suspended";
  else if (s === "in progress") className = "badge-status-in-progress";
  else if (s === "rejected") className = "badge-status-rejected";
  else if (s === "assigned") className = "badge-status-assigned";
  else if (s === "admin") className = "badge-role-admin";
  else if (s === "dispatcher") className = "badge-role-dispatcher";
  else if (s === "urgent") className = "badge-priority-urgent";
  else if (s === "normal") className = "badge-priority-normal";
  else if (s === "high") className = "badge-priority-high";
  else if (s === "medium") className = "badge-priority-medium";
  else if (s === "low") className = "badge-priority-low";

  return `<span class="badge ${className}">${status}</span>`;
};


// Actions renderer
window.renderActions = (actions = []) => {
  return `
    <div class="action-btns">
      ${actions
        .map(
          (action) => `
        <i class="${action.icon}" 
          title="${action.title || ""}" 
          onclick="${action.onClick || ""}">
        </i>
      `,
        )
        .join("")}
    </div>
  `;
};

/* GLOBAL DATATABLE HELPER */
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

  // Search
  $("#customSearch").on("keyup", function () {
    table.search(this.value).draw();
  });

  // Filters
  Object.keys(filters).forEach((selector) => {
    $(selector).on("change", function () {
      const val = $(this).val();
      table.column(filters[selector]).search(val).draw();
    });
  });

  return table;
};
