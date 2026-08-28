<?php include 'header.php'; ?>

<div class="row justify-content-center py-3">
  <div class="col-lg-8">
    <div class="card card-custom p-4 p-md-5 border-0">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
        <div>
          <p class="text-uppercase text-warning fw-bold mb-2" style="letter-spacing: 0.12em; font-size: 0.72rem;">AI helper</p>
          <h3 class="fw-bold mb-0"><i class="fa-solid fa-robot me-2 text-warning"></i> Food assistant</h3>
        </div>
        <span class="badge rounded-pill bg-warning-subtle text-warning px-3 py-2">Online</span>
      </div>
      <p class="text-muted">Ask our AI for meal suggestions, budget food combos, or nutrition-friendly picks.</p>
      
      <div id="chatBox" class="border rounded-4 p-3 mb-3 bg-light" style="height: 320px; overflow-y: auto;">
        <div class="text-start mb-2"><span class="badge bg-secondary rounded-pill">AI Bot:</span> Hi! What kind of food are you craving today?</div>
      </div>

      <div class="input-group input-group-lg">
        <input type="text" id="userInput" class="form-control" placeholder="e.g. Recommend a meal under ₦4,000...">
        <button class="btn btn-warning" onclick="sendMessage()">Send</button>
      </div>
    </div>
  </div>
</div>

<script>
function sendMessage() {
  let input = document.getElementById('userInput');
  let box = document.getElementById('chatBox');
  if(!input.value.trim()) return;

  box.innerHTML += `<div class="text-end mb-2"><span class="badge bg-warning text-dark rounded-pill">You:</span> ${input.value}</div>`;
  
  setTimeout(() => {
    box.innerHTML += `<div class="text-start mb-2"><span class="badge bg-secondary rounded-pill">AI Bot:</span> I recommend Jollof Rice with Chicken & Coleslaw (₦3,500) for a tasty value meal!</div>`;
    box.scrollTop = box.scrollHeight;
  }, 700);

  input.value = '';
}
</script>

<?php include 'footer.php'; ?>