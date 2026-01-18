// Sidebar Component
document.addEventListener("DOMContentLoaded", () => {
  loadSidebar();
});

function loadSidebar() {
  fetch("../common/sidebar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("sidebar-container").innerHTML = html;

      setActiveSidebarItem();
      handleSidebarToggle();
    })
    .catch((err) => console.error("Sidebar load error:", err));
}

// Active menu item
function setActiveSidebarItem() {
  const currentPage = document.body.dataset.page;

  document.querySelectorAll("#sidebar .menu li").forEach((item) => {
    if (item.dataset.page === currentPage) {
      item.classList.add("active");
    }
  });
}

// Toggle sidebar (mobile)
function handleSidebarToggle() {
  const burger = document.getElementById("burger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!burger || !sidebar || !overlay) return;

  burger.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  });
}
