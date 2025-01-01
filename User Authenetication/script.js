document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const otpForm = document.getElementById('otpForm');
    const successMessage = document.getElementById('successMessage');
    const contactType = document.getElementById('contactType');
    const contactInput = document.getElementById('contactInput');
    const contactError = document.getElementById('contactError');
    const otpInputs = document.querySelectorAll('.otp-input');
    const otpError = document.getElementById('otpError');
    const timerElement = document.getElementById('timer');
    const resendOtpBtn = document.getElementById('resendOtp');
    const maskedContact = document.getElementById('maskedContact');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');

    let timerInterval;
    const OTP_EXPIRY_TIME = 120; // 2 minutes in seconds

    const setLoading = (button, isLoading) => {
        const content = button.querySelector('.button-content');
        const loader = button.querySelector('.button-loader');

        if (isLoading) {
            content.classList.add('hidden');
            loader.classList.remove('hidden');
            button.disabled = true;
        } else {
            content.classList.remove('hidden');
            loader.classList.add('hidden');
            button.disabled = false;
        }
    };

    const showSuccess = (button) => {
        button.classList.add('success');
        const icon = button.querySelector('.button-content i');
        icon.className = 'fas fa-check';
    };

    const validateContact = () => {
        const value = contactInput.value.trim();
        const isEmail = contactType.value === 'email';

        if (!value) {
            contactError.textContent = `Please enter your ${isEmail ? 'email address' : 'mobile number'}`;
            contactInput.focus();
            return false;
        }

        if (isEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                contactError.textContent = 'Please enter a valid email address';
                contactInput.focus();
                return false;
            }
        } else {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(value)) {
                contactError.textContent = 'Please enter a valid mobile number (min. 10 digits)';
                contactInput.focus();
                return false;
            }
        }

        contactError.textContent = '';
        return true;
    };

    const validateOtp = () => {
        const otp = Array.from(otpInputs).map(input => input.value).join('');

        if (otp.length !== 6) {
            otpError.textContent = 'Please enter the complete 6-digit verification code';
            otpInputs[0].focus();
            return false;
        }

        if (!/^\d+$/.test(otp)) {
            otpError.textContent = 'Verification code should only contain numbers';
            otpInputs[0].focus();
            return false;
        }

        otpError.textContent = '';
        return true;
    };

    const maskContactInfo = (value, type) => {
        if (type === 'email') {
            const [username, domain] = value.split('@');
            const maskedUsername = username.charAt(0) + 
                                    '*'.repeat(Math.max(username.length - 2, 2)) + 
                                    username.charAt(username.length - 1);
            return `${maskedUsername}@${domain}`;
        } else {
            const digits = value.replace(/\D/g, '');
            const lastFour = digits.slice(-4);
            const maskedLength = Math.max(digits.length - 4, 6);
            return `+${'*'.repeat(maskedLength)}${lastFour}`;
        }
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateContact()) {
            try {
                setLoading(sendOtpBtn, true);

                const response = await fetch('https://your-backend-api/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: contactType.value,
                        contact: contactInput.value,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send OTP');
                }

                const { maskedContact: maskedValue } = await response.json();
                maskedContact.textContent = maskedValue;

                setLoading(sendOtpBtn, false);
                showSuccess(sendOtpBtn);

                setTimeout(() => {
                    contactForm.style.animation = 'slideOutLeft 0.5s forwards';
                    setTimeout(() => {
                        startOtpTimer();
                        otpForm.classList.remove('hidden');
                        contactForm.classList.add('hidden');
                        otpForm.style.animation = 'slideInRight 0.5s forwards';
                    }, 500);
                }, 1000);
            } catch (error) {
                setLoading(sendOtpBtn, false);
                contactError.textContent = error.message || 'Failed to send verification code. Please try again.';
            }
        }
    });

    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateOtp()) {
            try {
                setLoading(verifyOtpBtn, true);

                const otp = Array.from(otpInputs).map(input => input.value).join('');
                const response = await fetch('https://your-backend-api/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ otp }),
                });

                if (!response.ok) {
                    throw new Error('Invalid OTP');
                }

                setLoading(verifyOtpBtn, false);
                showSuccess(verifyOtpBtn);

                setTimeout(() => {
                    otpForm.style.animation = 'fadeOutUp 0.5s forwards';
                    setTimeout(() => {
                        clearInterval(timerInterval);
                        otpForm.classList.add('hidden');
                        successMessage.classList.remove('hidden');
                    }, 500);
                }, 1000);
            } catch (error) {
                setLoading(verifyOtpBtn, false);
                otpError.textContent = error.message || 'Invalid verification code. Please try again.';
            }
        }
    });

    resendOtpBtn.addEventListener('click', async () => {
        try {
            resendOtpBtn.disabled = true;
            resendOtpBtn.querySelector('span').textContent = 'Sending...';
            resendOtpBtn.querySelector('i').className = 'fas fa-circle-notch fa-spin';

            const response = await fetch('https://your-backend-api/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: contactType.value,
                    contact: contactInput.value,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend OTP');
            }

            resendOtpBtn.disabled = false;
            resendOtpBtn.querySelector('span').textContent = 'Resend Code';
            resendOtpBtn.querySelector('i').className = 'fas fa-redo';
            otpError.textContent = 'New verification code sent successfully!';
            otpError.style.color = 'var(--success-color)';
            startOtpTimer();
        } catch (error) {
            resendOtpBtn.disabled = false;
            otpError.textContent = error.message || 'Failed to resend code. Please try again.';
        }
    });

    const startOtpTimer = () => {
        let timeLeft = OTP_EXPIRY_TIME;
        timerElement.textContent = formatTime(timeLeft);

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                resend
