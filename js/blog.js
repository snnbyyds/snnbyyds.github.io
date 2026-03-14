/* ========================================
   Blog Page Functionality Module
   ======================================== */

class BlogController {
    constructor() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.displayedPosts = 6;
        this.init();
    }

    init() {
        this.setupSearchJavaScript();
        this.setupCategoryFilters();
        this.setupLoadMoreButton();
    }

    /* Search Functionality */
    setupSearchJavaScript() {
        const searchInput = document.getElementById('blogSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterAndDisplayPosts();
        });
    }

    /* Category Filter Functionality */
    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.currentFilter = button.getAttribute('data-category');
                this.filterAndDisplayPosts();
            });
        });
    }

    /* Filter and Display Posts */
    filterAndDisplayPosts() {
        const posts = document.querySelectorAll('.blog-card');
        const noResults = document.querySelector('.no-results');
        let visibleCount = 0;

        // Add fade transition
        const postsContainer = document.querySelector('.blog-posts');
        postsContainer.classList.add('filtering');

        setTimeout(() => {
            posts.forEach((post, index) => {
                const category = post.getAttribute('data-category');
                const title = post.querySelector('.blog-title')?.textContent.toLowerCase() || '';
                const excerpt = post.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
                
                // Check category filter
                const categoryMatch = this.currentFilter === 'all' || category === this.currentFilter;
                
                // Check search query
                const searchMatch = this.searchQuery === '' || 
                    title.includes(this.searchQuery) || 
                    excerpt.includes(this.searchQuery);
                
                // Check visibility limit
                const shouldDisplay = categoryMatch && searchMatch && index < this.displayedPosts;
                
                if (shouldDisplay) {
                    post.style.display = 'flex';
                    post.style.animation = 'fadeInUp 0.4s ease-out';
                    post.style.animationDelay = (visibleCount * 50) + 'ms';
                    post.style.animationFillMode = 'both';
                    visibleCount++;
                } else {
                    post.style.display = 'none';
                }
            });

            // Show/hide no results message
            if (visibleCount === 0) {
                noResults.style.display = 'block';
                noResults.style.animation = 'fadeInUp 0.4s ease-out';
            } else {
                noResults.style.display = 'none';
            }

            // Remove fade transition class
            postsContainer.classList.remove('filtering');
            postsContainer.classList.add('ready');
        }, 100);
    }

    /* Load More Functionality */
    setupLoadMoreButton() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            this.displayedPosts += 3;
            this.filterAndDisplayPosts();

            // Smooth scroll to end of newly loaded posts
            setTimeout(() => {
                const posts = document.querySelectorAll('.blog-card[style*="display: flex"]');
                if (posts.length > 0) {
                    const lastVisiblePost = posts[posts.length - 1];
                    lastVisiblePost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 300);
        });
    }
}

/* Initialize Blog Controller when DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
    window.blogController = new BlogController();
    
    // Setup scroll animations for blog cards
    if (window.animationController) {
        window.animationController.setupScrollAnimations();
    }
});

/* Optional: Add click handlers for read more links */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('read-more')) {
        e.preventDefault();
        console.log('Article link clicked:', e.target);
    }
});

