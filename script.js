// ============================================
// LOGIN SYSTEM
// ============================================

// Demo user database
const validUsers = [
    { email: 'demo@autocare.com', password: 'demo123', name: 'Demo User' },
    { email: 'admin@autocare.com', password: 'admin123', name: 'Admin User' },
    { email: 'test@test.com', password: 'test123', name: 'Test User' }
  ];
  
  // Check if user is logged in when page loads
  window.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = document.body.classList.contains('login-page');
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (isLoginPage) {
      if (currentUser) {
        window.location.href = 'index.html';
      }
    } else {
      if (!currentUser) {
        window.location.href = 'login.html';
      } else {
        const userEmail = JSON.parse(currentUser).email;
        document.getElementById('user-email').textContent = userEmail;
      }
    }
  });
  
  // Handle login
  function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        name: user.name
      }));
      window.location.href = 'index.html';
    } else {
      showError('Invalid email or password. Please try again.');
    }
  }
  
  function showError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    setTimeout(() => {
      errorDiv.classList.remove('show');
    }, 5000);
  }
  
  function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      sessionStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          handleLogin();
        }
      });
    }
  });
  // ============================================
// BOOKING SYSTEM
// ============================================

function generateBookingReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = 'AC-';
    for (let i = 0; i < 6; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }
  
  function submitBooking() {
    const name = document.getElementById('name').value.trim();
    const plate = document.getElementById('plate').value.trim().toUpperCase();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value.trim();
    
    if (!name || !plate || !date) {
      alert('Please fill in all required fields (Name, Plate Number, and Date)');
      return;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('Please select a future date for your booking');
      return;
    }
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const bookingRef = generateBookingReference();
    
    const booking = {
      reference: bookingRef,
      name: name,
      plate: plate,
      service: service,
      date: date,
      notes: notes,
      userEmail: currentUser.email,
      timestamp: new Date().toISOString()
    };
    
    let bookings = JSON.parse(sessionStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    sessionStorage.setItem('bookings', JSON.stringify(bookings));
    
    displayConfirmation(booking);
    
    document.getElementById('name').value = '';
    document.getElementById('plate').value = '';
    document.getElementById('date').value = '';
    document.getElementById('notes').value = '';
    
    document.getElementById('confirmation').scrollIntoView({ behavior: 'smooth' });
  }
  function displayConfirmation(booking) {
    const confirmDiv = document.getElementById('confirmation');
    const formattedDate = formatDate(booking.date);
    
    const html = `
      <h3>✅ Booking Confirmed!</h3>
      <p>Thank you, <strong>${booking.name}</strong>! Your service has been booked successfully.</p>
      
      <p><strong>Booking Reference:</strong> 
        <span class="booking-reference">${booking.reference}</span>
      </p>
      
      <p><strong>Vehicle:</strong> ${booking.plate}</p>
      <p><strong>Service:</strong> ${booking.service}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      
      ${booking.notes ? '<p><strong>Notes:</strong> ' + booking.notes + '</p>' : ''}
      
      <p style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #4CAF50;">
        📧 A confirmation email has been sent to <strong>${JSON.parse(sessionStorage.getItem('currentUser')).email}</strong>
      </p>
      
      <p style="font-size: 14px; color: #555; margin-top: 15px;">
        Please arrive 10 minutes before your scheduled time. Bring your booking reference.
      </p>
    `;
    
    confirmDiv.innerHTML = html;
    confirmDiv.classList.add('show');
    
    setTimeout(() => {
      confirmDiv.classList.remove('show');
    }, 30000);
  }