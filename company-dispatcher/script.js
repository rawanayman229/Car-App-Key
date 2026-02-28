document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  const closeBtn = document.getElementById("closeSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const body = document.body;

    /* ===== Active Link Logic ===== */
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".menu li a").forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.parentElement.classList.add("active");
    } else {
      link.parentElement.classList.remove("active");
    }
  });

  // Open sidebar
  const openSidebar = () => {
    body.classList.add("sidebar-open");
  };

  // Close sidebar
  const closeSidebar = () => {
    body.classList.remove("sidebar-open");
  };

  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      body.classList.toggle("sidebar-open");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  // Close sidebar automatically when resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeSidebar();
    }
  });
});
