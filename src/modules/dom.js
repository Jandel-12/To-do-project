export default class DOMController {
    constructor(projectManager) {
        // Store reference to ProjectManager (our data layer)
        this.projectManager = projectManager;
        
        // Track currently selected project
        this.currentProject = null;
        
        // Cache DOM elements so we don't query them repeatedly
        this.elements = {
            // Sidebar
            projectList: document.getElementById('projectList'),
            addProjectBtn: document.getElementById('addProjectBtn'),
            
            // Dashboard
            projectTitle: document.getElementById('projectTitle'),
            todoList: document.getElementById('todoList'),
            addTaskBtn: document.getElementById('addTaskBtn'),
            
            // Modal
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modalTitle'),
            modalForm: document.getElementById('modalForm'),
            closeModal: document.getElementById('closeModal')
        };
    }

    // Initialize the app - set up event listeners
    init() {
        console.log('🚀 DOMController initialized');
        this.setupEventListeners();
        this.renderProjects(); 
    }

    // Set up all event listeners
    setupEventListeners() {
        // Sidebar: Add Project button
        this.elements.addProjectBtn.addEventListener('click', () => {
            this.openProjectModal();
        });

        // Dashboard: Add Task button
        this.elements.addTaskBtn.addEventListener('click', () => {
            this.openTodoModal();
        });

        // Modal: Close button
        this.elements.closeModal.addEventListener('click', () => {
            this.closeModal();
        });

        // Modal: Click outside to close
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        console.log('✅ Event listeners set up');
    }

    // Render all projects in the sidebar
    renderProjects() {
        console.log('📋 Rendering projects...');
        
        // Get all projects from ProjectManager
        const projects = this.projectManager.getAllProject();
        
        // Clear the current list
        this.elements.projectList.innerHTML = '';
        
        // If no projects exist, show a message
        if (projects.length === 0) {
            this.elements.projectList.innerHTML = `
                <div style="color: #95a5a6; text-align: center; padding: 20px;">
                    No projects yet. Create one to get started!
                </div>
            `;
            return;
        }
        
        // Loop through each project and create HTML
        projects.forEach(project => {
            const projectElement = this.createProjectElement(project);
            this.elements.projectList.appendChild(projectElement);
        });
        
        console.log(`✅ Rendered ${projects.length} project(s)`);
    }

    // Create a single project element
    createProjectElement(project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.textContent = project.name;
        
        // Store project name as data attribute for easy access
        div.dataset.projectName = project.name;
        
        // Add active class if this is the current project
        if (this.currentProject && this.currentProject.name === project.name) {
            div.classList.add('active');
        }
        
        // Add click handler to select this project
        div.addEventListener('click', () => {
            this.selectProject(project.name);
        });
        
        return div;
    }

    // Select a project and display its todos
    selectProject(projectName) {
        console.log(`🔍 Selecting project: ${projectName}`);
        
        // Find the project
        this.currentProject = this.projectManager.findProject(projectName);
        
        if (!this.currentProject) {
            console.error('❌ Project not found');
            return;
        }
        
        // Update UI
        this.elements.projectTitle.textContent = this.currentProject.name;
        this.elements.addTaskBtn.disabled = false; // Enable "Add Task" button
        
        // Re-render projects to update active state
        this.renderProjects();
        
        // Render todos for this project (we'll build this next)
        this.renderTodos();
    }

    openProjectModal() {
        console.log('🔵 Opening project modal...');
        
        // Set modal title
        this.elements.modalTitle.textContent = 'Add New Project';
        
        // Create form HTML for adding a project
        this.elements.modalForm.innerHTML = `
            <div class="form-group">
                <label for="projectName">Project Name *</label>
                <input 
                    type="text" 
                    id="projectName" 
                    placeholder="e.g., Work, Personal, Shopping" 
                    required
                    autocomplete="off"
                >
            </div>
            
            <div class="form-actions">
                <button type="button" class="cancel-btn" id="cancelBtn">Cancel</button>
                <button type="submit" class="submit-btn">Create Project</button>
            </div>
        `;
        
        // Show modal
        this.elements.modal.classList.add('active');
        
        // Focus on input field
        setTimeout(() => {
            document.getElementById('projectName').focus();
        }, 100);
        
        // Set up form submission
        this.elements.modalForm.onsubmit = (e) => {
            e.preventDefault();
            this.handleProjectSubmit();
        };
        
        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });
    }

    openTodoModal() {
        console.log('🔵 Opening todo modal...');
        
        // Make sure a project is selected
        if (!this.currentProject) {
            alert('Please select a project first!');
            return;
        }
        
        // Set modal title
        this.elements.modalTitle.textContent = `Add Task to "${this.currentProject.name}"`;
        
        // Create form HTML for adding a task
        this.elements.modalForm.innerHTML = `
            <div class="form-group">
                <label for="taskName">Task Title *</label>
                <input 
                    type="text" 
                    id="taskName" 
                    placeholder="e.g., Finish report" 
                    required
                    autocomplete="off"
                >
            </div>
            
            <div class="form-group">
                <label for="taskDescription">Description</label>
                <textarea 
                    id="taskDescription" 
                    placeholder="Add details about this task..."
                ></textarea>
            </div>
            
            <div class="form-group">
                <label for="taskDueDate">Due Date</label>
                <input 
                    type="date" 
                    id="taskDueDate"
                >
            </div>
            
            <div class="form-group">
                <label for="taskPriority">Priority *</label>
                <select id="taskPriority" required>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            
            <div class="form-actions">
                <button type="button" class="cancel-btn" id="cancelBtn">Cancel</button>
                <button type="submit" class="submit-btn">Add Task</button>
            </div>
        `;
        
        // Show modal
        this.elements.modal.classList.add('active');
        
        // Focus on input field
        setTimeout(() => {
            document.getElementById('taskName').focus();
        }, 100);
        
        // Set up form submission
        this.elements.modalForm.onsubmit = (e) => {
            e.preventDefault();
            this.handleTodoSubmit();
        };
        
        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });
    }

    // Handle project form submission
    handleProjectSubmit() {
        const projectNameInput = document.getElementById('projectName');
        const projectName = projectNameInput.value.trim();
        
        // Validate
        if (!projectName) {
            alert('Please enter a project name!');
            return;
        }
        
        // Check if project already exists
        const existingProject = this.projectManager.findProject(projectName);
        if (existingProject) {
            alert('A project with this name already exists!');
            return;
        }
        
        // Create project
        const newProject = this.projectManager.addProject(projectName);
        console.log(`✅ Created project: ${projectName}`);
        
        // Update UI
        this.renderProjects();
        this.selectProject(projectName); // Auto-select the new project
        
        // Close modal
        this.closeModal();
    }

    // Handle todo form submission
    handleTodoSubmit() {
        // Get form values
        const taskName = document.getElementById('taskName').value.trim();
        const taskDescription = document.getElementById('taskDescription').value.trim();
        const taskDueDate = document.getElementById('taskDueDate').value;
        const taskPriority = document.getElementById('taskPriority').value;
        
        // Validate
        if (!taskName) {
            alert('Please enter a task title!');
            return;
        }
        
        // Create todo
        this.projectManager.addTodoToProject(
            this.currentProject.name,
            taskName,
            taskDescription,
            taskDueDate,
            taskPriority
        );
        
        console.log(`✅ Created todo: ${taskName} in ${this.currentProject.name}`);
        
        // Update UI
        this.renderTodos();
        
        // Close modal
        this.closeModal();
    }

    renderTodos() {
        console.log('📝 Rendering todos...');
        
        // Clear the todo list
        this.elements.todoList.innerHTML = '';
        
        // Make sure we have a project selected
        if (!this.currentProject) {
            this.elements.todoList.innerHTML = `
                <div class="empty-state">
                    <h3>No Project Selected</h3>
                    <p>Select a project from the sidebar or create a new one to get started!</p>
                </div>
            `;
            return;
        }
        
        // Get todos from current project
        const todos = this.currentProject.getTodo();
        
        // If no todos exist, show empty state
        if (todos.length === 0) {
            this.elements.todoList.innerHTML = `
                <div class="empty-state">
                    <h3>No Tasks Yet</h3>
                    <p>Click "Add Task" to create your first todo!</p>
                </div>
            `;
            return;
        }
        
        // Loop through todos and create elements
        todos.forEach((todo, index) => {
            const todoElement = this.createTodoElement(todo, index);
            this.elements.todoList.appendChild(todoElement);
        });
        
        console.log(`✅ Rendered ${todos.length} todo(s)`);
    }

    // Create a single todo element
    createTodoElement(todo, index) {
        // Main container
        const div = document.createElement('div');
        div.className = 'todo-item';
        
        // Add completed class if task is done
        if (todo.completed) {
            div.classList.add('completed');
        }
        
        // Todo content section
        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';
        
        // Task title
        const title = document.createElement('h3');
        title.textContent = todo.task;
        contentDiv.appendChild(title);
        
        // Description (if exists)
        if (todo.description) {
            const description = document.createElement('p');
            description.textContent = todo.description;
            contentDiv.appendChild(description);
        }
        
        // Meta info (due date and priority)
        const metaDiv = document.createElement('div');
        metaDiv.className = 'todo-meta';
        
        // Due date
        if (todo.duedate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.textContent = `📅 Due: ${todo.duedate}`;
            metaDiv.appendChild(dueDateSpan);
        }
        
        // Priority badge
        const prioritySpan = document.createElement('span');
        prioritySpan.className = `priority ${todo.priority}`;
        prioritySpan.textContent = todo.priority.toUpperCase();
        metaDiv.appendChild(prioritySpan);
        
        contentDiv.appendChild(metaDiv);
        
        // Action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'todo-actions';
        
        // Complete/Uncomplete button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
        completeBtn.addEventListener('click', () => {
            this.toggleTodoComplete(index);
        });
        actionsDiv.appendChild(completeBtn);
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            this.deleteTodo(index);
        });
        actionsDiv.appendChild(deleteBtn);
        
        // Assemble everything
        div.appendChild(contentDiv);
        div.appendChild(actionsDiv);
        
        return div;
    }

    // Toggle todo completion status
    toggleTodoComplete(index) {
        if (!this.currentProject) return;
        
        const todos = this.currentProject.getTodo();
        const todo = todos[index];
        
        if (todo) {
            todo.toggleComplete();
            console.log(`✅ Toggled todo: ${todo.task} - Completed: ${todo.completed}`);
            this.renderTodos(); // Re-render to show updated state
        }
    }

    // Delete a todo
    deleteTodo(index) {
        if (!this.currentProject) return;
        
        const todos = this.currentProject.getTodo();
        const todo = todos[index];
        
        if (todo && confirm(`Delete "${todo.task}"?`)) {
            this.currentProject.deleteTodo(index);
            console.log(`🗑️ Deleted todo: ${todo.task}`);
            this.renderTodos(); // Re-render to show updated list
        }
    }

    closeModal() {
        console.log('❌ Closing modal...');
        this.elements.modal.classList.remove('active');
    }
}