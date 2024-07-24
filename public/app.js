document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.submit').forEach(button => {
        button.addEventListener('click', (event) => {
            const currentCard = event.target.closest('.item');
            const regInput = currentCard.querySelector('input[type="text"]').value;
            //alert(`Regex Submitted: ${regInput}`);
        });
    });

    document.querySelectorAll('.hint').forEach(button => {
        button.addEventListener('click', (event) => {
            const currentCard = event.target.closest('.item');
            //alert(currentCard.querySelector('.hint').textContent);
        });
    });
});
