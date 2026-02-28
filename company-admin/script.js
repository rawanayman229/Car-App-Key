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
function renderStatusBadge(status) {
  const s = status.toLowerCase();
  let cls = "status-pending";

  if (s === "completed") cls = "status-completed";
  else if (s === "pending") cls = "status-pending";
  else if (s === "in progress") cls = "status-inprogress";
  else if (s === "cancelled") cls = "status-cancelled";
  else if (s === "approved") cls = "status-approved";
  else if (s === "rejected") cls = "status-rejected";
  else if (s === "collected") cls = "status-collected";
  else if (s === "active") cls = "status-active";
  else if (s === "inactive") cls = "status-inactive";
  else if (s === "sent to technician") cls = "status-sent";
  return `<span class="badge-soft ${cls}">${status}</span>`;
}

function renderPriorityBadge(priority) {
  const p = priority.toLowerCase();
  let cls = "priority-normal";

  if (p === "urgent") cls = "priority-urgent";
  else if (p === "high") cls = "priority-high";
  else if (p === "normal") cls = "priority-normal";

  return `<span class="${cls}">${priority}</span>`;
}

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
    pageLength: 5,
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
