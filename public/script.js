document.addEventListener('DOMContentLoaded', () =>{
    const taskInput = document.querySelector('.task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const inputForm = document.querySelector('.input-area');

    // Show/hide empty image
    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    };

    // Party celebration logic
    const partyContainer = document.getElementById('party-celebration');
    let confettiActive = false;
    function showParty() {
        if (confettiActive) return;
        confettiActive = true;
        partyContainer.style.display = 'block';
        // Simple confetti animation
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            partyContainer.appendChild(confetti);
        }
        setTimeout(() => {
            partyContainer.style.display = 'none';
            partyContainer.innerHTML = '';
            confettiActive = false;
        }, 2500);
    }

    function checkAllCompleted() {
        const total = taskList.children.length;
        const completed = taskList.querySelectorAll('li.completed').length;
        if (total > 0 && completed === total) {
            showParty();
        }
    }

    // Update progress bar
    const updateProgressBar = () => {
        const total = taskList.children.length;
        const completed = taskList.querySelectorAll('li.completed').length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        const progressBar = document.getElementById('progress-bar');
        const progressLabel = document.getElementById('progress-label');
        const progressPercent = document.getElementById('progress-percent');
        if (progressBar) {
            let fill = progressBar.querySelector('.progress-fill');
            if (!fill) {
                fill = document.createElement('div');
                fill.className = 'progress-fill';
                fill.style.height = '100%';
                fill.style.borderRadius = '8px';
                fill.style.transition = 'width 0.5s cubic-bezier(.4,2,.6,1), background 0.5s';
                progressBar.appendChild(fill);
            }
            fill.style.width = percent + '%';
            // Dynamic color: red (<=20%), yellow (<=60%), green (>=90%)
            let color;
            if (percent <= 20) {
                color = '#f44336'; // red
            } else if (percent <= 60) {
                color = '#ffeb3b'; // yellow
            } else if (percent >= 90) {
                color = '#4caf50'; // green
            } else {
                color = '#ff9800'; // orange (for 61-89%)
            }
            fill.style.background = color;
        }
        if (progressLabel) {
            progressLabel.innerHTML = `<div>${total - completed} left</div>`;
        }
        if (progressPercent) {
            progressPercent.textContent = `${percent}% completed`;
        }
        checkAllCompleted();
    };

    // Add a new task
    const addTask = (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span class="task-text">${taskText}</span>
            <span class="task-actions">
                <button class="delete-btn"><i class="fa fa-trash"></i></button>
                <button class="edit-btn"><i class="fa fa-pen"></i></button>
            </span>
        `;
        // Mark as completed
        li.querySelector('.task-checkbox').addEventListener('change', function() {
            li.classList.toggle('completed', this.checked);
            updateProgressBar();
        });
        // Edit task
        li.querySelector('.edit-btn').addEventListener('click', function() {
            if (li.classList.contains('completed')) return; // Prevent editing if completed
            const span = li.querySelector('.task-text');
            const currentText = span.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-input';
            span.replaceWith(input);
            input.focus();
            input.addEventListener('blur', function() {
                span.textContent = input.value.trim() || currentText;
                input.replaceWith(span);
                saveTasks();
            });
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', function() {
            li.remove();
            toggleEmptyState();
            saveTasks();
            updateProgressBar();
        });
        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        saveTasks();
        updateProgressBar();
    };

    // Save tasks to localStorage
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <span class="task-actions">
                    <button class="delete-btn"><i class="fa fa-trash"></i></button>
                    <button class="edit-btn"><i class="fa fa-pen"></i></button>
                </span>
            `;
            if (task.completed) li.classList.add('completed');
            li.querySelector('.task-checkbox').addEventListener('change', function() {
                li.classList.toggle('completed', this.checked);
                saveTasks();
                updateProgressBar();
            });
            li.querySelector('.edit-btn').addEventListener('click', function() {
                if (li.classList.contains('completed')) return; // Prevent editing if completed
                const span = li.querySelector('.task-text');
                const currentText = span.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.className = 'edit-input';
                span.replaceWith(input);
                input.focus();
                input.addEventListener('blur', function() {
                    span.textContent = input.value.trim() || currentText;
                    input.replaceWith(span);
                    saveTasks();
                });
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });
            });
            li.querySelector('.delete-btn').addEventListener('click', function() {
                li.remove();
                toggleEmptyState();
                saveTasks();
                updateProgressBar();
            });
            taskList.appendChild(li);
        });
        toggleEmptyState();
        updateProgressBar();
    };

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    inputForm.addEventListener('submit', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        }
    });

    // Initial load
    loadTasks();
})