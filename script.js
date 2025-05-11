document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });

    // Initialize carousel
    initCarousel();

    // Initialize size chart animations
    initSizeChart();
});

// Carousel functionality
let currentSlide = 0;
const totalSlides = 7;
const track = document.getElementById('carouselTrack');
const indicators = document.querySelectorAll('.carousel-indicator');

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('bg-white');
            indicator.classList.remove('bg-gray-300');
        } else {
            indicator.classList.remove('bg-white');
            indicator.classList.add('bg-gray-300');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function initCarousel() {
    updateCarousel();
    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
}

// Size Chart Interactions
function initSizeChart() {
    const sizeRows = document.querySelectorAll('.size-row');
    const sizeChartContainer = document.querySelector('.size-chart-container');
    const unitToggle = document.getElementById('unitToggle');
    const widthCells = document.querySelectorAll('.width-cell');
    const lengthCells = document.querySelectorAll('.length-cell');
    const CM_TO_INCHES = 0.393701;
    
    sizeRows.forEach(row => {
        row.classList.add('table-row-animate');
    });

    sizeChartContainer?.addEventListener('mouseenter', () => {
        sizeChartContainer.classList.add('transform', 'scale-102');
    });

    sizeChartContainer?.addEventListener('mouseleave', () => {
        sizeChartContainer.classList.remove('transform', 'scale-102');
    });

    sizeRows.forEach(row => {
        row.addEventListener('click', () => {
            sizeRows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
            
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                cell.classList.add('size-highlight');
                setTimeout(() => cell.classList.remove('size-highlight'), 500);
            });

            const size = row.getAttribute('data-size');
            const fit = row.querySelector('td:last-child').textContent;
            showSizeRecommendation(size, fit);
        });
    });

    function convertMeasurement(value, toInches) {
        if (toInches) {
            return (value * CM_TO_INCHES).toFixed(1);
        }
        return value;
    }

    unitToggle?.addEventListener('change', () => {
        const isInches = unitToggle.checked;
        
        widthCells.forEach(cell => {
            const cmValue = parseInt(cell.getAttribute('data-cm'));
            cell.textContent = convertMeasurement(cmValue, isInches);
            cell.classList.add('size-highlight');
            setTimeout(() => cell.classList.remove('size-highlight'), 500);
        });
        
        lengthCells.forEach(cell => {
            const cmValue = parseInt(cell.getAttribute('data-cm'));
            cell.textContent = convertMeasurement(cmValue, isInches);
            cell.classList.add('size-highlight');
            setTimeout(() => cell.classList.remove('size-highlight'), 500);
        });
    });
}

// Show size recommendation tooltip
function showSizeRecommendation(size, fit) {
    const existingRecommendation = document.querySelector('.size-recommendation');
    if (existingRecommendation) {
        existingRecommendation.remove();
    }

    const recommendation = document.createElement('div');
    recommendation.className = 'size-recommendation fixed bottom-8 right-8 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 z-50';
    recommendation.innerHTML = `
        <div class="flex items-center">
            <div class="mr-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div>
                <p class="font-medium">Size ${size} Selected</p>
                <p class="text-sm opacity-90">${fit}</p>
            </div>
        </div>
    `;

    document.body.appendChild(recommendation);

    setTimeout(() => {
        recommendation.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => recommendation.remove(), 300);
    }, 3000);
}

// Modal functionality
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');

function openModal(imageSrc) {
    modalImage.src = imageSrc;
    imageModal.classList.remove('hidden');
    imageModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');
    document.body.style.overflow = '';
}

// Close modal when clicking outside the image
imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        closeModal();
    }
});

// Close on escape key
document.addEventListener('keydown', function(e) {
    if (!imageModal.classList.contains('hidden') && e.key === 'Escape') {
        closeModal();
    }
});
