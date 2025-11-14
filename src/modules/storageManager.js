import { parse } from "date-fns";


export default class toDoStorage{
    constructor(){
        this.storageKey = 'todoAppKey';
    }


    saveProjects(projectManager){
        try{
            const projects = projectManager.getAllProjects();

            const projectData = projects.map(project => ({
                name: project.name,
                todo: project.toDoStorage.map(todo =>({
                    task: todo.task,
                    description: todo.description,
                    duedate: todo.duedate,
                    priority: todo.priority,
                    projectCathergory: todo.projectCathergory,
                    completed: todo.completed
                }))
            }))

            localStorage.setItem(this.storageKey, JSON.stringify(projectData));
        }
        catch(error)
        {
            console.error("bitch you failed"); 
        }

        
    }

    loadProjects(){
        try{
            const data = localStorage.getItem(this.storageKey)

            if(!data){
                console.log("no data/ if expecting data maybe something wrong");
                return null;
            }

            const projectData = JSON.parse(data);
            return projectData;

        }catch(error){

        }
    }
}