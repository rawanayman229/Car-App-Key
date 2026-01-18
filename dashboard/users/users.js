document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("usersTable");
  const tbody = table.querySelector("tbody");
  const openBtn = document.getElementById("openCreateUser");
  const createBtn = document.getElementById("createUserBtn");
  const form = document.getElementById("createUserForm");
  const allRows = Array.from(tbody.querySelectorAll("tr"));
  let filteredRows = [...allRows];

  const searchInput = document.getElementById("tableSearch");
  const pagination = document.getElementById("pagination");
  const tableInfo = document.getElementById("tableInfo");

  const passwordResetModal = new bootstrap.Modal(
    document.getElementById("passwordResetModal")
  );

  const openResetBtn = document.getElementById("openPasswordReset");
  const resetSearch = document.getElementById("resetSearch");
  const sendResetBtn = document.getElementById("sendResetLink");

  const resetName = document.getElementById("resetName");
  const resetEmail = document.getElementById("resetEmail");
  const resetRole = document.getElementById("resetRole");
  const resetStatus = document.getElementById("resetStatus");

  let selectedUser = null;

  const rowsPerPage = 8;
  let currentPage = 1;
  const roleButtons = document.querySelectorAll(".filter-btn");

  // Create New USer Modal
  const createUserModal = new bootstrap.Modal(
    document.getElementById("createUserModal")
  );
  // Open modal
  openBtn.addEventListener("click", () => {
    form.reset();
    createUserModal.show();
  });

  // Create user
  createBtn.addEventListener("click", () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById("fullName").value;
    const role = document.getElementById("role").value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${role}</td>
      <td>Company Name</td>
      <td>
        <span class="status-pill">Active</span>
      </td>
      <td>
        <div class="d-flex gap-1 adjust-btn">
          <button class="edit-btn">Edit</button>
          <p>|</p>
          <button class="delete-btn">Delete</button>
        </div>
      </td>
    `;

    tbody.prepend(row);

    createUserModal.hide();
  });

  // Password Reset Modal
  // Open modal
  openResetBtn.addEventListener("click", () => {
    resetSearch.value = "";
    resetName.textContent = "—";
    resetEmail.textContent = "—";
    resetRole.textContent = "—";
    resetStatus.textContent = "—";
    sendResetBtn.disabled = true;
    passwordResetModal.show();
  });

  // Search user from table
  resetSearch.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    selectedUser = null;

    allRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      if (text.includes(value) && value !== "") {
        selectedUser = row;
      }
    });

    if (selectedUser) {
      const tds = selectedUser.querySelectorAll("td");
      resetName.textContent = tds[0].textContent;
      resetRole.textContent = tds[1].textContent;
      resetEmail.textContent =
        tds[0].textContent.replace(" ", ".").toLowerCase() + "@email.com";
      resetStatus.textContent = tds[3].textContent.trim();

      sendResetBtn.disabled = false;
    } else {
      sendResetBtn.disabled = true;
    }
  });

  // Send reset link
  sendResetBtn.addEventListener("click", () => {
    alert("Password reset link has been sent successfully!");
    passwordResetModal.hide();
  });

  // Edit \ Delete Actions
  table.addEventListener("click", function (e) {
    const target = e.target;

    if (target.classList.contains("delete-btn")) {
      const row = target.closest("tr");
      row.remove();
    }

    if (target.classList.contains("edit-btn")) {
      const row = target.closest("tr");
      const tds = row.querySelectorAll("td:not(:last-child)");
      if (target.textContent === "Edit") {
        tds.forEach((td) => {
          if (td.querySelector(".status-pill")) {
            const statusText = td.textContent.trim();
            td.innerHTML = `
              <select class="form-select form-select-sm">
                <option value="Active" ${
                  statusText === "Active" ? "selected" : ""
                }>Active</option>
                <option value="Inactive" ${
                  statusText === "Inactive" ? "selected" : ""
                }>Inactive</option>
              </select>`;
          } else {
            td.dataset.original = td.textContent;
            td.innerHTML = `<input type="text" class="form-control form-control-sm" value="${td.textContent}">`;
          }
        });
        target.textContent = "Save";
        target.classList.remove("btn-primary");
        target.classList.add("btn-success");
      } else {
        // Save edits
        tds.forEach((td) => {
          const input = td.querySelector("input");
          const select = td.querySelector("select");
          if (input) {
            td.textContent = input.value;
          }
          if (select) {
            const val = select.value;
            td.innerHTML = `<span class="status-pill ${
              val === "Inactive" ? "status-inactive" : ""
            }">${val}</span>`;
          }
        });
        target.textContent = "Edit";
        target.classList.remove("btn-success");
        target.classList.add("btn-primary");
      }
    }
  });

  //   Pagination
  function renderTable() {
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    filteredRows.slice(start, end).forEach((row) => {
      tbody.appendChild(row);
    });

    renderPagination();
    renderInfo();
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;

      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.textContent = i;

      a.addEventListener("click", function (e) {
        e.preventDefault();
        currentPage = i;
        renderTable();
      });

      li.appendChild(a);
      pagination.appendChild(li);
    }
  }

  function renderInfo() {
    if (!tableInfo) return;
    if (filteredRows.length === 0) {
      tableInfo.textContent = "No users found";
      return;
    }

    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, filteredRows.length);

    tableInfo.textContent = `Showing ${start}–${end} of ${filteredRows.length} users`;
  }

  //Search + Filter Role
  searchInput.addEventListener("input", applyFilters);

  roleButtons.forEach(btn => {
    btn.onclick = () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    };
  });

  function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();
    const activeBtn = document.querySelector(".filter-btn.active");
    const selectedRole = activeBtn.dataset.role;

    filteredRows = allRows.filter(row => {
      const role = row.children[1].textContent.trim();
      return (
        (selectedRole === "All" || role === selectedRole) &&
        row.textContent.toLowerCase().includes(searchValue)
      );
    });

    currentPage = 1;
    renderTable();
  }
      renderTable();

});
