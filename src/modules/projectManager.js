import Project from "./project.js";

export default class ProjectManager{
    constructor(){
        this.project = [];
    }

    addProject(name){
        const newProject = new Project(name);
        this.project.push(newProject);
        return newProject;
    }   

    getAllProject(){
        return this.project;
    }

    findProject(name){
        return this.project.find(projectName => projectName.name === name)
    }

    addTodoToProject(projectName,task, description, duedate, priority ){
        const project = this.findProject(projectName);

        if(project){
           return  project.createProject(task, description, duedate, priority)
        }
        else{
            console.log("Project Not found");
        }
    }
}