// Listen for input changes and update the preview
document.querySelectorAll('#ticketForm input, #ticketForm select').forEach(input => {
  input.addEventListener('input', updatePreview);
});

let qrCode; // Store QR code instance to prevent regeneration

const ticketPrices = {
  Regular: 50,
  VIP: 100
};

function updatePreview() {
  // Ensure all required fields are filled
  if (!document.getElementById('eventName').value || !document.getElementById('eventDate').value || !document.getElementById('eventTime').value || !document.getElementById('location').value || !document.getElementById('attendeeName').value) {
    return;
  }

  // Show the preview container
  document.getElementById('ticketPreview').style.display = 'block';

  // Set preview values
  const ticketCount = parseInt(document.getElementById('ticketCount').value) || 1;
  const ticketContainer = document.getElementById('ticketContainer');
  ticketContainer.innerHTML = ''; // Clear previous previews

  const ticketType = document.getElementById('ticketType').value;
  const ticketPrice = ticketPrices[ticketType] || 50; // Default to 50 for regular if not found

  // Generate the preview for each ticket
  for (let i = 0; i < ticketCount; i++) {
    const ticketElement = document.createElement('div');
    ticketElement.classList.add('ticket');
    ticketElement.innerHTML = `
      <p><strong>Event:</strong> ${document.getElementById('eventName').value}</p>
      <p><strong>Date:</strong> ${document.getElementById('eventDate').value}</p>
      <p><strong>Time:</strong> ${document.getElementById('eventTime').value}</p>
      <p><strong>Location:</strong> ${document.getElementById('location').value}</p>
      <p><strong>Attendee:</strong> ${document.getElementById('attendeeName').value}</p>
      <p><strong>Ticket Type:</strong> ${ticketType}</p>
    `;

    // Add VIP styling if VIP ticket is selected
    if (ticketType === 'VIP') {
      ticketElement.classList.add('vip-ticket');
    }

    // Generate QR Code for each ticket
    const qrData = `Event: ${document.getElementById('eventName').value}\nDate: ${document.getElementById('eventDate').value}\nTime: ${document.getElementById('eventTime').value}`;
    const qrCodeDiv = document.createElement('div');
    qrCodeDiv.id = `qrcode${i}`;
    ticketElement.appendChild(qrCodeDiv);

    new QRCode(qrCodeDiv, {
      text: qrData,
      width: 100,
      height: 100
    });

    ticketContainer.appendChild(ticketElement);
  }

  // Calculate and display the total price
  const totalPrice = ticketCount * ticketPrice;
  const couponCode = document.getElementById('couponCode').value.trim();
  if (couponCode === "DISCOUNT10") {
    totalPrice *= 0.9; // Apply 10% discount
  }

  document.getElementById('totalPrice').textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

// Handle form submission
document.getElementById("ticketForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  // Simulate email confirmation
  const email = document.getElementById('email').value;
  if (email) {
    alert(`Confirmation email sent to ${email}`);
  }

  alert("Tickets generated successfully!");

  // You can include additional logic to handle ticket data and email sending if needed
});

// Download ticket as an image
document.getElementById('downloadImage').addEventListener('click', function() {
  const ticketElements = document.querySelectorAll('.ticket');
  ticketElements.forEach(ticket => {
    html2canvas(ticket).then(function(canvas) {
      const link = document.createElement('a');
      link.download = 'ticket.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });
});

// Download ticket as a PDF
document.getElementById('downloadPDF').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const ticketElements = document.querySelectorAll('.ticket');
  ticketElements.forEach((ticket, index) => {
    html2canvas(ticket).then(function(canvas) {
      const imgData = canvas.toDataURL('image/png');
      if (index > 0) doc.addPage();
      doc.addImage(imgData, 'PNG', 10, 10);
      if (index === ticketElements.length - 1) {
        doc.save('tickets.pdf');
      }
    });
  });
});
