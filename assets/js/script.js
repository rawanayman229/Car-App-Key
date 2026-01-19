document.addEventListener("DOMContentLoaded", () => {
    
// HTML Elements
const toggleBtn = document.getElementById("toggleSidebar");
const closeBtn = document.getElementById("closeSidebar");
const overlay = document.getElementById("sidebarOverlay");
const body = document.body;
const menuLinks = document.querySelectorAll(".menu li a");


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
  menuLinks.forEach(link => {
    link.addEventListener("click", function() {

      // Remove active from all
      menuLinks.forEach(l => l.parentElement.classList.remove("active"));

      // Add active to clicked one
      this.parentElement.classList.add("active");

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
        { name: 'Jobs', type: 'line', data: [110, 140, 170, 190, 220, 248] },
        { name: 'Revenue ($)', type: 'line', data: [45000, 52000, 65000, 72000, 85000, 94320] }
      ],
      
      chart: { height: 300, type: 'line', toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#2b84e4', '#10b981'],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] }
    }).render();
  }

  if (pieEl) {
    new ApexCharts(pieEl, {
      series: [75, 18, 7],
      chart: { type: 'donut', height: 320 },
      labels: ['Active', 'Inactive', 'Pending'],
      colors: ['#10b981', '#64748b', '#f59e0b'],
      legend: { position: 'bottom' }
    }).render();
  }
});