const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

// 1. Toggle Sidebar
toggleSidebar.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("show");
    mainContent.classList.toggle("shift");
});

// 2. Close Sidebar 
mainContent.addEventListener("click", () => {
    if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show");
        mainContent.classList.remove("shift");
    }
});

// 3. Highlight Active Link & Close sidebar on selection
const links = document.querySelectorAll(".sidebar a, .nav-links a");
const currentPage = window.location.pathname.split("/").pop();

links.forEach(link => {
    // Highlight
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }

    // Close on click (for mobile)
    link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("show");
            mainContent.classList.remove("shift");
        }
    });
});