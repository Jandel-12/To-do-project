import { ta } from "date-fns/locale";
import toDoStorage from "./storageManager";

export default class DOMcontroller{
    constructor(manager,storage){
        this.manager = manager;

        this.storage = storage;

        this.currentProject = null;

        //all selector
        this.element = {
            //sidebar
            projectList: document.getElementById("projectList"),
            projectBtn: document.getElementById("addProjectBtn"),
            //dashboard
            addTaskBtn: document.getElementById("addTaskBtn"),
            todoList: document.getElementById("todoList"),
            projectTitle: document.getElementById("projectTitle"),
            // Modal
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modalTitle'),
            modalForm: document.getElementById('modalForm'),
            closeModal: document.getElementById('closeModal')
        }
    }

    
    setupEventListener(){


        this.element.projectBtn.addEventListener('click', ()=>{
            //add project button open modal for project
            this.openProjectModal();
        });

        this.element.addTaskBtn.addEventListener('click', ()=>{
            //add task open modal for task
            this.openTaskModal();
        });

        this.element.closeModal.addEventListener('click', ()=>{
            this.closeModal();
        })

        this.element.modal.addEventListener('click', (e)=>{
            if(e.target === this.element.modal){
                this.closeModal();
            }
        })

    }

    //initialize the dom
    init(){
        this.setupEventListener();
        this.renderProjects();
    }


    //modal function
    openProjectModal(){
        this.element.modalTitle.textContent = 'Add New Project';
        
        this.element.modalForm.innerHTML = `
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

            this.element.modal.classList.add('active')

            setTimeout(()=>{
                document.getElementById('projectName')
            },100)

            this.element.modalForm.onsubmit = (e) =>{
                e.preventDefault();
                this.handleProjectSubmit();
            }

            cancelBtn.addEventListener('click',()=>{
            this.closeModal();
            })
    }




    openTaskModal(){

        if(this.currentProject === null){
            alert("Please Select A Project First");
            return
        }
        this.element.modalTitle.textContent = `Add Task to  ${this.currentProject}`;
        
        this.element.modalForm.innerHTML = `
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

            this.element.modal.classList.add('active')

            setTimeout(()=>{
                document.getElementById('taskName').focus()
            },100)

            this.element.modalForm.onsubmit = (e) =>{
                e.preventDefault();
                this.handleTaskSubmit();
            }

            cancelBtn.addEventListener('click',()=>{
            this.closeModal();
            })
    }

    closeModal(){
        this.element.modal.classList.remove('active');
    }

    //renderer for project
    renderProjects(){
        const projects = this.manager.getAllProjects();
        this.element.projectList.innerHTML = "";

        if(projects.length === 0){
                        this.element.projectList.innerHTML = `
                <div style="color: #95a5a6; text-align: center; padding: 20px;">
                    No projects yet. Create one to get started!
                </div>
            `;
            return;
        }

        projects.forEach(projects => {
            this.createProjectElement(projects)
        });
    }

    createProjectElement(project){
        const div = document.createElement("div");
        div.classList.add("project-item");
        div.innerHTML = project.name;
        
        
        //delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\uD83D\uDDD1"
        deleteBtn.classList.add("delete-project")
        deleteBtn.addEventListener('click', ()=>{
            this.removeProject(project)
        })
        div.appendChild(deleteBtn)

        this.element.projectList.appendChild(div);
        
        div.addEventListener('click',()=>{
            this.selectProject(project);
        })
        return div
    }

    removeProject(project){
            const result = confirm("Are you sure you want to delete?");
            if (result) {
                
                alert("Item deleted successfully!");
            } else {
                
                alert("Deletion cancelled.");
                return
            }
        
        
        this.manager.removeProject(project.name);

        this.storage.saveProjects(this.manager)
        this.renderProjects();
    }


    // Select Project fuction
    selectProject(project){
    
        this.currentProject = project;
   
        this.element.projectTitle.innerText =  `Project: ${project.name}`;
        this.element.addTaskBtn.disabled = false;



        this.renderProjects();
        this.renderTodo();

        return this.currentProject
    }
    //Form handlers

    handleProjectSubmit(){
        const projectInput = document.getElementById("projectName");
        const projectName = projectInput.value.trim();

        //check if project already exist
        if(this.manager.findProject(projectName) === "Project Doesn't Exist"){
            const newProject = this.manager.createProject(projectName);            

        } else
        {
            alert("This project Already exist")
            return
        }

        this.storage.saveProjects(this.manager);

        this.renderProjects();
        this.closeModal();
    }


    renderTodo() {

        const tasks = this.currentProject.getAllTask();
        this.element.todoList.innerHTML = "";
        if (tasks.length === 0) {
            this.element.todoList.innerHTML = `
                <div class="empty-state">
                    <h3>No Tasks Yet</h3>
                    <p>Click "Add Task" to create your first todo!</p>
                </div>
            `;
            return;
        }

        tasks.forEach((task, index)=>{
           const taskList = this.createTaskElement(task,index);
            this.element.todoList.appendChild(taskList)
        })
    }


    createTaskElement(todo, index){

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

    //handle submit

    handleTaskSubmit(){
        const taskName = document.getElementById('taskName').value.trim();
        const taskDescription = document.getElementById('taskDescription').value.trim();
        const taskDueDate = document.getElementById('taskDueDate').value;
        const taskPriority = document.getElementById('taskPriority').value;

        const projectIndex = this.manager.findProject(this.currentProject.name);
        const project = this.manager.getAllProjects()[projectIndex]

        project.createTask(
            taskName,
            taskDescription,
            taskDueDate,
            taskPriority,
        )

        this.storage.saveProjects(this.manager);

        

        this.renderTodo(project)
        this.closeModal()
    }

    toggleTodoComplete(index){
       const currentTask = this.currentProject.getAllTask()[index];
        currentTask.toggleComplete()

        this.storage.saveProjects(this.manager);

        this.renderTodo(this.currentProject);
    }

    deleteTodo(index){
        this.currentProject.removeTask(index)


        this.storage.saveProjects(this.manager);

        this.renderTodo(this.currentProject)
    }
    
}




