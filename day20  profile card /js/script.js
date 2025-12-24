document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.getElementById('followBtn');
    
    followBtn.addEventListener('click', function() {
        // Toggle the 'following' state
        if (this.innerText === "Follow") {
            this.innerText = "Following";
            
            // Add a visual change for the active state
            this.style.background = "var(--text-dark)";
            this.style.boxShadow = "none";
            
            // Optional: Simulate sending a request
            console.log("User followed!");
        } else {
            this.innerText = "Follow";
            
            // Reset styles to CSS default (removing inline styles)
            this.style.background = "";
            this.style.boxShadow = "";
            
            console.log("User unfollowed.");
        }
    });
});