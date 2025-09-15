document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toolbar button').forEach((button) => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            document.execCommand(command, false, null);
        });
    });
});
