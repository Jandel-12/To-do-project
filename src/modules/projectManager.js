import Project from "./project.js";
//create Projects 


export default class ProjectManager{
    constructor(){
        this.projects = []
    }

    createProject(name){
        const newProject = new Project(name);
        this.projects.push(newProject);
        return newProject
    }

    getAllProjects(){
        return this.projects
    }

    findProject(name) {
        const project = this.projects.findIndex(element => element.name === name);
        return project !== -1 ? project : "Project Doesn't Exist";
    }

    removeProject(name){
        this.projects.splice(this.findProject(name), 1);
        return this.projects
    }


    loadFromData(projectData){
        this.projects = [];

        

        if(!projectData || projectData.length === 0)
        {
           
            return
        }

        projectData.forEach( projectData => {
            
            const project = new Project(projectData.name)

            if(projectData.toDoStorage && projectData.toDoStorage.length > 0){
                project.forEach(todoData =>{

                    const todo = project.createTask(            
                        todoData.taskName,
                        todoData.taskDescription,
                        todoData.taskDueDate,
                        todoData.taskPriority,
                        );

                    if(todoData.completed){
                        todo.toggleComplete();
                    }
                });
            }

            this.projects.push(project);
        });

        
    }

}