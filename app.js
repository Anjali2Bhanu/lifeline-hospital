// LifeLine Hospital Interactive Controller

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set default appointment dates to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateString = tomorrow.toISOString().split('T')[0];

    const quickDateInput = document.getElementById('quick-date');
    const mainDateInput = document.getElementById('patient-date');

    if (quickDateInput) {
        quickDateInput.min = minDateString;
        quickDateInput.value = minDateString;
    }
    if (mainDateInput) {
        mainDateInput.min = minDateString;
        mainDateInput.value = minDateString;
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 3. Modal Elements
    const modal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalPatientName = document.getElementById('modal-patient-name');
    const modalBookingId = document.getElementById('modal-booking-id');
    const modalDept = document.getElementById('modal-dept');
    const modalDoctor = document.getElementById('modal-doctor');
    const modalDateTime = document.getElementById('modal-datetime');

    function showConfirmationModal(details) {
        if (!modal) return;
        modalPatientName.textContent = details.name;
        modalBookingId.textContent = details.id;
        modalDept.textContent = details.dept;
        modalDoctor.textContent = details.doctor || 'Senior Consultant';
        modalDateTime.textContent = `${details.date} (${details.timeSlot || 'Standard Slot'})`;
        
        modal.classList.remove('hidden');
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close when clicking outside content box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // 4. Toast Notification helper
    function showToast(message, icon = '✅') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');

        if (!toast) return;

        toastMessage.textContent = message;
        toastIcon.textContent = icon;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 4000);
    }

    // 5. Quick Hero Appointment Form Handler
    const heroQuickForm = document.getElementById('hero-quick-form');
    if (heroQuickForm) {
        heroQuickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('quick-name').value.trim();
            const phone = document.getElementById('quick-phone').value.trim();
            const dept = document.getElementById('quick-dept').value;
            const date = document.getElementById('quick-date').value;

            if (!name || !phone || !date) {
                alert('Please fill out all required fields.');
                return;
            }

            const bookingRef = 'LLH-' + Math.floor(100000 + Math.random() * 900000);
            const bookingRecord = {
                id: bookingRef,
                name: name,
                phone: phone,
                dept: dept,
                doctor: 'Assigned on arrival',
                date: date,
                timeSlot: 'Morning OPD',
                createdAt: new Date().toISOString()
            };

            saveBooking(bookingRecord);
            showConfirmationModal(bookingRecord);
            heroQuickForm.reset();
            if (quickDateInput) quickDateInput.value = minDateString;
        });
    }

    // 6. Main Detailed Appointment Form Handler
    const mainForm = document.getElementById('main-appointment-form');
    if (mainForm) {
        mainForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('patient-name').value.trim();
            const phone = document.getElementById('patient-phone').value.trim();
            const email = document.getElementById('patient-email').value.trim();
            const age = document.getElementById('patient-age').value.trim();
            const gender = document.getElementById('patient-gender').value;
            const dept = document.getElementById('patient-dept').value;
            const doctor = document.getElementById('patient-doctor').value;
            const date = document.getElementById('patient-date').value;
            const timeSlot = document.getElementById('patient-time').value;
            const notes = document.getElementById('patient-notes').value.trim();

            if (!name || !phone || !date) {
                alert('Please fill out the required patient fields.');
                return;
            }

            const bookingRef = 'LLH-' + Math.floor(100000 + Math.random() * 900000);
            const bookingRecord = {
                id: bookingRef,
                name: name,
                phone: phone,
                email: email,
                age: age,
                gender: gender,
                dept: dept,
                doctor: doctor,
                date: date,
                timeSlot: timeSlot,
                notes: notes,
                createdAt: new Date().toISOString()
            };

            saveBooking(bookingRecord);
            showConfirmationModal(bookingRecord);
            mainForm.reset();
            if (mainDateInput) mainDateInput.value = minDateString;
        });
    }

    // 7. Contact / Inquiry Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value.trim();
            showToast(`Thank you, ${name}. Your message has been sent to admin@lifelinehospital.net.in!`, '📨');
            contactForm.reset();
        });
    }

    // Helper: Save booking to localStorage
    function saveBooking(booking) {
        try {
            const existing = JSON.parse(localStorage.getItem('lifeline_appointments') || '[]');
            existing.push(booking);
            localStorage.setItem('lifeline_appointments', JSON.stringify(existing));
        } catch (e) {
            console.error('Storage error', e);
        }
    }
});
