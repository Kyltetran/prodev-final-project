// Function to remove accents and normalize Vietnamese text
function removeAccents(str) {
    return str
        .normalize("NFD") // Normalize to decomposed form
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
        .replace(/đ/g, "d") // Convert 'đ' to 'd'
        .replace(/Đ/g, "D") // Convert 'Đ' to 'D'
        .toLowerCase(); // Convert to lowercase
}

// Load the external SVG file
fetch('assets/vietnam.svg')
    .then(response => response.text())
    .then(svgContent => {
        // Insert SVG content into the container
        document.getElementById('svg-container').innerHTML = svgContent;

        const tooltip = document.getElementById('tooltip');
        const modal = document.getElementById('region-modal');
        const modalContent = document.getElementById('modal-content');
        const closeModalButton = document.getElementById('close-modal');
        const regionDetails = document.getElementById('region-details'); // Container with region details

        const regions = document.querySelectorAll('#svg-container path[title]');

        regions.forEach(region => {
            // Show tooltip on hover
            region.addEventListener('mouseover', () => {
                tooltip.style.display = 'block';
                tooltip.textContent = region.getAttribute('title');
            });

            // Hide tooltip when not hovering
            region.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
            });

            // Update tooltip position dynamically
            region.addEventListener('mousemove', (event) => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;

                const svgContainer = document.getElementById('svg-container');
                const containerRect = svgContainer.getBoundingClientRect();

                let left = event.clientX - containerRect.left + 10;
                let top = event.clientY - containerRect.top + 10;

                if (left + tooltipWidth > containerRect.width) {
                    left -= tooltipWidth + 20;
                }

                if (top + tooltipHeight > containerRect.height) {
                    top -= tooltipHeight + 20;
                }

                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });

            // Show modal on click for specific regions
            region.addEventListener('click', () => {
                const regionId = region.id; // Get the region ID
                const regionContent = regionDetails.querySelector(`#${regionId}`); // Find matching content
                if (regionContent) {
                    modalContent.innerHTML = regionContent.innerHTML; // Set modal content
                    modal.style.display = 'block'; // Show modal
                } else {
                    modalContent.innerHTML = `<p>No details available for: ${region.getAttribute('title')}</p>`;
                    modal.style.display = 'block';
                }
            });

            region.addEventListener('mouseenter', () => {
                region.style.fill = '#b0b0b0';
                region.style.cursor = 'pointer';
            });

            region.addEventListener('mouseleave', () => {
                region.style.fill = '';
            });
        });

        // Close modal
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Search functionality
        const searchInput = document.getElementById('region-search');
        const searchButton = document.getElementById('search-button');

        const searchFunction = () => {
            const query = removeAccents(searchInput.value.trim()); // Normalize the input
            let found = false;

            regions.forEach(region => {
                const regionName = removeAccents(region.getAttribute('title')); // Normalize the region name

                if (regionName === query) {
                    found = true;
                    // Highlight region
                    region.style.fill = '#b0b0b0'; // Change highlight color to gray

                    // Show tooltip below the region
                    const bbox = region.getBoundingClientRect();
                    const svgContainer = document.getElementById('svg-container').getBoundingClientRect();

                    tooltip.style.display = 'block';
                    tooltip.textContent = region.getAttribute('title');

                    // Position tooltip below the region
                    tooltip.style.left = `${bbox.left - svgContainer.left + bbox.width / 2 - tooltip.offsetWidth / 2}px`;
                    tooltip.style.top = `${bbox.bottom - svgContainer.top + 10}px`;

                    // Remove highlight and hide tooltip after 3 seconds
                    setTimeout(() => {
                        region.style.fill = ''; // Reset region color
                        tooltip.style.display = 'none'; // Hide tooltip
                    }, 3000); // 3 seconds
                }
            });

            if (!found) {
                alert('Region not found! Please try again.');
            }
        };

        // Trigger search on button click
        searchButton.addEventListener('click', searchFunction);

        // Trigger search on Enter key press
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchFunction();
            }
        });
    })
    .catch(error => console.error('Error loading SVG:', error));

// Scroll to the map when "Regions Exploration" button is clicked
document.getElementById('regions-exploration').addEventListener('click', () => {
    const mapElement = document.getElementById('map');
    mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


// Show Hanoi map popup when Hanoi is clicked
document.querySelector('#VN-HN').addEventListener('click', () => {
    const modal = document.getElementById('region-modal');
    const hanoiPopup = document.getElementById('hanoi-popup');
    modal.style.display = 'block';
    hanoiPopup.style.display = 'block'; // Show only Hanoi-specific content
    document.body.style.overflow = 'hidden'; // Disable scrolling
});

// Close modal
document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('region-modal');
    const hanoiPopup = document.getElementById('hanoi-popup');
    modal.style.display = 'none';
    hanoiPopup.style.display = 'none'; // Hide Hanoi-specific content
    document.body.style.overflow = 'auto'; // Enable scrolling
});

document.getElementById('discussion').addEventListener('click', () => {
    window.location.href = 'forum.html';
});

// Search functionality
document.getElementById('search-button').addEventListener('click', () => {
    const searchQuery = document.getElementById('post-search').value.trim().toLowerCase();
    if (searchQuery) {
        console.log(`Searching for: ${searchQuery}`); // Replace with actual search logic
    }
});

// Category filter functionality
document.getElementById('category-filter').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    console.log(`Filtering by category: ${selectedCategory}`); // Replace with actual filter logic
});

// Function to fetch approved posts from Google Apps Script
async function loadApprovedPosts() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxfK-V7T2NqrqYhA5Wwh0X5i6p2_TRCACQ8pVzTBslS981r0DPrZHQnUVVtqnfz3_T9Rg/exec');
        const posts = await response.json();
        
        // Get the container where posts will be displayed
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = ''; // Clear existing posts

        // Loop through posts and display them
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><em>Category: ${post.category} | Date: ${new Date(post.date).toLocaleString()}</em></p>
            `;
            postsList.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Call this function when the page loads to display the posts
window.onload = loadApprovedPosts;