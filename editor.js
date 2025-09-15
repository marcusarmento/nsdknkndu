document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor-de-texto');

    function updateActiveStates() {
        document.querySelectorAll('.toolbar button').forEach((button) => {
            const command = button.dataset.command;
            if (document.queryCommandState(command)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.toolbar button').forEach((button) => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            document.execCommand(command, false, null);
            editor.focus();
            updateActiveStates();
        });
    });

    editor.addEventListener('keyup', updateActiveStates);
    editor.addEventListener('mouseup', updateActiveStates);
    editor.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            let handled = true;
            switch (e.key.toLowerCase()) {
                case 'b':
                    document.execCommand('bold');
                    break;
                case 'i':
                    document.execCommand('italic');
                    break;
                case 'u':
                    document.execCommand('underline');
                    break;
                default:
                    handled = false;
            }
            if (handled) {
                e.preventDefault();
                updateActiveStates();
            }
        }
    });

    updateActiveStates();
});
